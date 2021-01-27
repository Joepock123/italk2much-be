import { Router, Request, Response, NextFunction } from "express";
import { addMessage, createOrUpdatePersonalChat } from "./chatsQueries";

const chatsRouter = Router();

chatsRouter.get(
  "/chats/:chatId",
  (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    console.log("In the GET chat route", "chatId", chatId);
  }
);

chatsRouter.put(
  "/chat",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    try {
      const response = await createOrUpdatePersonalChat({ ...body });
      res.json({ message: "Chat successfully created" });
      console.log("createOrUpdatePersonalChat RESPONSE:", response);
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
