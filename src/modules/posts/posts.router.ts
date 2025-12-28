import express from 'express';
import { postController } from './posts.controller';


const router = express.Router();


router.post('/posts', postController.createPost);
router.get('/posts', postController.getAllPosts);


export const postsRouter = router;