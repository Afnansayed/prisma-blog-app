import express from 'express';
import { postController } from './posts.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();

router.post('/posts', auth(UserRole.ADMIN), postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:postId', postController.getPostById);

export const postsRouter = router;
