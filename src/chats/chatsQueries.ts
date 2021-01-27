import { now } from "moment";
import { v4 as uuidv4 } from "uuid";

import { documentClient } from "../infrastructure/dynamoDb";
import { Chat, Message } from "./types";

const MEMBER_KEY = "member_";
const CONFIG_KEY = "config";

// CHATS TABLE QUERIES
const chatTableName = "chatsWithSortKey";

// NB: Transactions can handle up to 10 action requests
// For creation of group chats number of members + 1 (chatConfigAction) must be <= 10
export const createOrUpdatePersonalChat = async ({
  chatName,
  members,
}: Chat) => {
  // Should be only two members for personal chat
  const chatId = members.join("-");

  // Action to create item for chat configuration
  const chatConfigAction = {
    // Specify the action type (can also use update, delete)
    Put: {
      TableName: chatTableName,
      Item: {
        chatId,
        sortKey: CONFIG_KEY,
        chatName,
        createdAt: now(),
        lastTouched: now(),
      },
    },
  };

  // Actions to create item for each member of chat
  const chatMembersAction = members.map((member) => {
    const sortKey = [MEMBER_KEY, member].join("");
    return {
      Put: {
        TableName: chatTableName,
        Item: {
          chatId,
          sortKey,
          createdAt: now(),
          lastTouched: now(),
        },
      },
    };
  });

  // Create the array of actions
  const transactionParams = {
    TransactItems: [...chatMembersAction, chatConfigAction],
  };

  const res =
    documentClient &&
    (await documentClient.transactWrite(transactionParams).promise());
  return res;
};

export const getChatConfig = async (chatId: string) => {
  const params = {
    TableName: chatTableName,
    Key: {
      chatId,
      sortKey: CONFIG_KEY,
    },
  };

  const { Item } =
    documentClient && (await documentClient.get(params).promise());
  return Item;
};

var params = {
  TableName: "Movies",
  ProjectionExpression: "#yr, title, info.genres, info.actors[0]",
  KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",
  ExpressionAttributeNames: {
    "#yr": "year",
  },
  ExpressionAttributeValues: {
    ":yyyy": 1992,
    ":letter1": "A",
    ":letter2": "L",
  },
};

export const getChatMembers = async (chatId: string) => {
  const params = {
    TableName: chatTableName,
    KeyConditionExpression: "chatId = :hkey and begins_with(sortKey, :rkey)",
    ExpressionAttributeValues: {
      ":hkey": chatId,
      ":rkey": MEMBER_KEY,
    },
  };

  const { Items } =
    documentClient && (await documentClient.query(params).promise());
  return Items;
};

// MESSAGES TABLE QUERIES
const messageTableName = "messages";
export const addMessage = async ({ chatId, ownerId, text }: Message) => {
  const params = {
    TableName: messageTableName,
    Item: {
      messageId: uuidv4(),
      chatId,
      ownerId,
      createdAt: now(),
      lastTouched: now(),
      text: text,
    },
    ReturnValues: "ALL_OLD",
  };

  const res = documentClient && (await documentClient.put(params).promise());
  return res;
};
