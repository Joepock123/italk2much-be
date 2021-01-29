import { Router, Request, Response, NextFunction } from "express";
import {
  addMessage,
  createOrUpdatePersonalChat,
  getChatConfig,
  getChatMembers,
  getChatMessages,
  getMemberItemsFromUserId,
} from "./chatsQueries";

const chatsRouter = Router();

chatsRouter.get(
  "/chats/user/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    try {
      const chatMembers = await getMemberItemsFromUserId(userId);
      const chatIdsList = chatMembers?.map((chat) => chat.chatId) || [];
      const chats = await Promise.all(
        chatIdsList?.map(async (chatId) => {
          const chatConfig = await getChatConfig(chatId);
          const chatMembers = await getChatMembers(chatId);
          const chatMessages = await getChatMessages(chatId);
          return {
            ...chatConfig,
            members: chatMembers,
            messages: chatMessages,
          };
        })
      );
      res.send({ chats });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  }
);

chatsRouter.get(
  "/chats/:chatId",
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    try {
      const chatConfig = await getChatConfig(chatId);
      const chatMembers = await getChatMembers(chatId);
      const chatMessages = await getChatMessages(chatId);
      res.send({ ...chatConfig, members: chatMembers, messages: chatMessages });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  }
);

chatsRouter.put(
  "/chat",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    try {
      const response = await createOrUpdatePersonalChat({ ...body });
      res.json({ message: "Chat successfully created" });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  }
);

chatsRouter.put(
  "/chats/:chatId/message",
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    const body = req.body;
    try {
      await addMessage({ chatId, ...body });
      res.json({ message: "Message successfully added to database" });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  }
);

export { chatsRouter };
