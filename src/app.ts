import express, { Application } from "express";
import cors from "cors";
import { postsRouter } from "./modules/posts/posts.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

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

export default app;

