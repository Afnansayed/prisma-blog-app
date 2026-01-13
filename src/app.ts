import express, { Application } from "express";
import cors from "cors";
import { postsRouter } from "./modules/posts/posts.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { commentsRouter } from "./modules/comments/comments.router";
import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app: Application = express();

app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true
}))


app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("Welcome to the Prisma Blog App!");
});


app.use('/api/v1', postsRouter);

// comments router
app.use('/api/v1', commentsRouter);

// not found handler
app.use(notFound);
// error handler
app.use(errorHandler);
export default app;

