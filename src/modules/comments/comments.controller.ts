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
const getCommentById = async (req: Request, res: Response) => {
  if (!req.params.commentId) {
    return res.status(400).json({
      message: "Comment Id is required",
    });
  }

  try {
    const result = await commentsService.getCommentById(req.params.commentId as string);
    res.status(200).json({
      message: "Comment fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};


const getCommentsByAuthor = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params
        const result = await commentsService.getCommentsByAuthor(authorId as string)
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Comment fetched failed",
            details: e
        })
    }
}
const deleteCommentById = async (req: Request, res: Response) => {
    const payload = {
        commentId: req.params.commentId as string,
        authorId: req.user?.id as string
    };
    try {
        const result = await commentsService.deleteCommentById(payload)
        res.status(200).json({
            message: "Comment deleted successfully",
            data: result
        })
    } catch (e) {
        res.status(400).json({
            error: "Comment deleted failed",
            details: e
        })
    }
};

const updateComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentsService.updateComment(commentId as string, req.body, user?.id as string)
        res.status(200).json({
            message: "Comment updated successfully",
            data: result
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: "Comment update failed!",
            details: e
        })
    }
}

export const commentsController = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteCommentById,
  updateComment
};
