import express from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { commentsController } from './comments.controller';


const router = express.Router();

router.get(
    "/comments/author/:authorId",
    commentsController.getCommentsByAuthor
)
router.post('/comments', auth(UserRole.USER , UserRole.ADMIN), commentsController.createComment);
router.get('/comments/:commentId', commentsController.getCommentById);

export const commentsRouter = router;

