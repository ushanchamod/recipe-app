import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares";
import cookieParser from "cookie-parser";
import { recipeRouter, userRouter } from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import config from "./config/config";

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method}, Request URL: ${req.url}`);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: config.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  })
);

app.options("/{*any}", (req: Request, res: Response) => res.status(200).send());

app.use("/api/user", userRouter);
app.use("/api/recipes", recipeRouter);

app.use(errorHandler);

export default app;
