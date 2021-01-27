import { now } from "moment";
import { v4 as uuidv4 } from "uuid";

import { documentClient } from "../infrastructure/dynamoDb";
import { Chat, Message } from "./types";

const MEMBER_PREFIX = "member_";

// CHATS TABLE QUERIES
const chatTableName = "chatsWithSortKey";

// Transaction
// NB: Transactions can handle up to 10 action requests
// Threfor for creation of group chats number of members + 1 (chatConfigAction) must be <= 10
export const createOrUpdatePersonalChat = async ({
  chatName,
  members,
}: Chat) => {
  // Create chatId with userIds
  const chatId = members.join("-");

  // Action to create item for chat configuration
  const chatConfigAction = {
    // Specify the action type (can also use update, delete)
    Put: {
      TableName: chatTableName,
      Item: {
        chatId,
        sortKey: "config",
        chatName,
        createdAt: now(),
        lastTouched: now(),
      },
    },
  };

  // Actions to create item for each member of chat
  const chatMembersAction = members.map((member) => {
    const sortKey = [MEMBER_PREFIX, member].join("");
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

  const response =
    documentClient &&
    (await documentClient.transactWrite(transactionParams).promise());
  return response;
};

export const updateChatConfig = async ({
  chatId,
  chatName,
}: {
  chatId: string;
  chatName?: string;
}) => {};

export const updateChatMember = async ({
  chatId,
  members,
}: {
  chatId: string;
  members: Array<string>;
}) => {};

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

  const response =
    documentClient && (await documentClient.put(params).promise());
  return response;
};

var params = {
  TransactItems: [
    {
      Put: {
        TableName: "Table0",
        Item: {
          HashKey: "haskey",
          NumAttribute: 1,
          BoolAttribute: true,
          ListAttribute: [1, "two", false],
          MapAttribute: { foo: "bar" },
          NullAttribute: null,
        },
      },
    },
    {
      Update: {
        TableName: "Table1",
        Key: { HashKey: "hashkey" },
        UpdateExpression: "set #a = :x + :y",
        ConditionExpression: "#a < :MAX",
        ExpressionAttributeNames: { "#a": "Sum" },
        ExpressionAttributeValues: {
          ":x": 20,
          ":y": 45,
          ":MAX": 100,
        },
      },
    },
  ],
};
