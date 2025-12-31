import express, { NextFunction, Request, Response } from "express";
import { postController } from "./posts.controller";

const router = express.Router();

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("middleware !!!!!!!!");
    next();
  };
};

router.post("/posts", auth(), postController.createPost);
router.get("/posts", postController.getAllPosts);

export const postsRouter = router;
