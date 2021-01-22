import { Router, Request, Response, NextFunction } from "express";

const videosRouter = Router();

videosRouter.get(
  "/videos",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("In the videosRouter!");
    res.json(mockVideosArray);
  }
);

export { videosRouter };

const mockVideosArray = [
  {
    videoId: "aa",
    actorId: "11",
    name: "Thomas the Tank",
    description: "My first scene",
  },
  {
    videoId: "ab",
    actorId: "12",
    name: "Lady San Martin",
    description: "The scene of my life",
  },
];
