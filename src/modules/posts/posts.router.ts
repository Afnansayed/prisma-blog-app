import express from 'express';
import { postController } from './posts.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();

router.post('/posts', auth(UserRole.ADMIN, UserRole.USER), postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/my-posts', auth(UserRole.USER, UserRole.ADMIN), postController.getMyPosts);
router.get('/posts/:postId', postController.getPostById);
router.patch('/posts/:postId', auth(UserRole.USER, UserRole.ADMIN), postController.updatePosts);
router.delete('/posts/:postId', auth(UserRole.USER, UserRole.ADMIN), postController.deletePost);


export const postsRouter = router;
