import express, { Application } from "express";
import { postsRouter } from "./modules/posts/posts.router";

const app: Application = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.send("Welcome to the Prisma Blog App!");
});

app.use('/api/v1', postsRouter);

export default app;

