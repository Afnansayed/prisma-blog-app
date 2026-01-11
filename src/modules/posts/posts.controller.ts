import { Request, Response } from 'express';
import { postService } from './posts.service';
import paginationSortingHelpers from '../../helpers/paginationSortingHelper';
import { auth } from './../../lib/auth';
import { UserRole } from '../../middleware/auth';

const createPost = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id;
    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.body.authorId = authorId;
    const result = await postService.createPost(req.body);
    res.status(201).json({
      message: 'Post created successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  const { search } = req.query;
  const searchString = typeof search === 'string' ? search : undefined;

  const tags = req.query.tags ? (req.query.tags as string).split(',') : [];
  // console.log(tags);
  //pagination
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelpers(
    req.query
  );

  try {
    const posts = await postService.getAllPosts({
      search: searchString,
      tags,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error('Post Id is required!');
    }
    const result = await postService.getPostById(postId);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: 'Post creation failed',
      details: e,
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
       if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await postService.getMyPosts(req.user?.id as string);
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: result,
    });
  } catch (e) {
    const errorMessage = (e instanceof Error) ? e.message : 'Posts fetched failed';
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
}

const updatePosts = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isAdmin = req.user?.role === UserRole.ADMIN;
    const result = await postService.updatePosts(req?.params?.postId as string, req.body , req.user?.id as string, isAdmin);
    res.status(200).json({
      message: 'Posts updated successfully',
      data: result,
    });
  } catch (e) {
    const errorMessage = (e instanceof Error) ? e.message : 'Posts update failed';
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
}

export const postController = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePosts
};
