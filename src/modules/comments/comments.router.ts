import express from "express";
import auth, { UserRole } from "../../middleware/auth";
import { commentsController } from "./comments.controller";

const router = express.Router();

router.get(
  "/comments/author/:authorId",
  commentsController.getCommentsByAuthor
);
router.post(
  "/comments",
  auth(UserRole.USER, UserRole.ADMIN),
  commentsController.createComment
);
router.get("/comments/:commentId", commentsController.getCommentById);
router.delete(
  "/comments/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentsController.deleteCommentById
);
router.patch(
  "/comments/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentsController.updateComment
);
router.patch(
  "/comments/:commentId/moderate",
  auth(UserRole.USER, UserRole.ADMIN),
  commentsController.modarteComment
);

export const commentsRouter = router;
