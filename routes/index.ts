import { Router, Request, Response, NextFunction } from "express";

const indexRouter = Router();

indexRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("In the indexRouter!");
  res.json({ msg: "This is the JSON for the homepage" });
});

export { indexRouter };
