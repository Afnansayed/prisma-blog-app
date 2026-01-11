import { Request, Response } from "express";
import { commentsService } from "./comments.service";

const createComment = async (req: Request, res: Response) => {
  const payload = {
    authorId: req.user?.id,
    ...req.body,
  };
  try {
    const result = await commentsService.createComment(payload);
    res.status(201).json({
      message: "Comment created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

export const commentsController = {
  createComment,
};
