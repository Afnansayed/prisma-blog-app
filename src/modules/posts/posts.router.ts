import express, { NextFunction, Request, Response } from 'express';
import { postController } from './posts.controller';
import { auth as betterAuth } from '../../lib/auth';
import { success } from 'better-auth/*';

const router = express.Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        emailVerified: boolean;
        role: string;
      };
    }
  }
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //   get user session
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email to access this resource',
      });
    }
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
      role: session.user.role as string,
    };

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to this resource',
      });
    }
    // console.log(session, 13);
    next();
  };
};

router.post('/posts', auth(UserRole.ADMIN), postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:postId', postController.getPostById);

export const postsRouter = router;
