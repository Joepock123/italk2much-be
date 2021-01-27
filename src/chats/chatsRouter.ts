import { Router, Request, Response, NextFunction } from "express";
import { addMessage } from "./chatsQueries";

const chatsRouter = Router();

chatsRouter.get(
  "/chats/:chatId",
  (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    console.log("In the GET chat route", "chatId", chatId);
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
