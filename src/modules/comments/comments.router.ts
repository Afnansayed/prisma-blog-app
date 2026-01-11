import express from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { commentsController } from './comments.controller';


const router = express.Router();

router.post('/comments', auth(UserRole.USER , UserRole.ADMIN), commentsController.createComment);

export const commentsRouter = router;

