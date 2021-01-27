import { now } from "moment";
import { v4 as uuidv4 } from "uuid";

import { documentClient } from "../infrastructure/dynamoDb";
import { Message } from "./types";

const messagetableName = "messages";
export const addMessage = async ({ chatId, ownerId, text }: Message) => {
  const params = {
    TableName: messagetableName,
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
