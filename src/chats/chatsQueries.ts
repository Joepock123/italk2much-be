import { time } from "console";
import { now } from "moment";
import { v4 as uuidv4 } from "uuid";

import { documentClient } from "../infrastructure/dynamoDb";
import { Chat, Message } from "./types";

const CONFIG_KEY = "config";
const MEMBER_KEY = "member_";
const MESSAGE_KEY = "message_";
const CHATS_TABLE_NAME = "chatsWithSortKey";
const CHATS_GSI_NAME = "sortKeyIndex";
const MESSAGES_TABLE_NAME = "messagesWithSortKey";

// CHATS TABLE QUERIES

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
      TableName: CHATS_TABLE_NAME,
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
        TableName: CHATS_TABLE_NAME,
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

export const getMemberItemsFromUserId = async (userId: string) => {
  const gsiKey = [MEMBER_KEY, userId].join("");
  const params = {
    TableName: CHATS_TABLE_NAME,
    IndexName: CHATS_GSI_NAME,
    KeyConditionExpression: "sortKey = :hkey",
    ExpressionAttributeValues: {
      ":hkey": gsiKey,
    },
  };

  const { Items } =
    documentClient && (await documentClient.query(params).promise());
  return Items;
};

export const getChatConfig = async (chatId: string) => {
  const params = {
    TableName: CHATS_TABLE_NAME,
    Key: {
      chatId,
      sortKey: CONFIG_KEY,
    },
  };

  const { Item } =
    documentClient && (await documentClient.get(params).promise());
  return Item;
};

export const getChatMembers = async (chatId: string) => {
  const params = {
    TableName: CHATS_TABLE_NAME,
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

export const getChatMessages = async (chatId: string) => {
  const params = {
    TableName: MESSAGES_TABLE_NAME,
    KeyConditionExpression: "chatId = :hkey",
    ExpressionAttributeValues: {
      ":hkey": chatId,
    },
  };

  const { Items } =
    documentClient && (await documentClient.query(params).promise());
  return Items;
};

export const addMessage = async ({ chatId, ownerId, text }: Message) => {
  const timestamp = now();
  const messageId = uuidv4();
  const sortKey = [MESSAGE_KEY, timestamp, messageId].join("_");
  const params = {
    TableName: MESSAGES_TABLE_NAME,
    Item: {
      chatId,
      sortKey,
      messageId,
      ownerId,
      createdAt: timestamp,
      lastTouched: timestamp,
      text: text,
    },
  };

  const res = documentClient && (await documentClient.put(params).promise());
  return res;
};
