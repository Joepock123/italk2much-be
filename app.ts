const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
import { Request, Response, NextFunction } from "express";

import { indexRouter } from "./routes";
import { chatsRouter } from "./src/chats/chatsRouter";
import { videosRouter } from "./src/videos/videosRouter";

const app = express();

app.set("port", process.env.PORT || 8080);
// view engine setup ???
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(cors());

// *** Routes ***
app.use("/", [indexRouter, videosRouter, chatsRouter]);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(
    `Express server listening at http://localhost:${app.get("port")}`
  );
});
