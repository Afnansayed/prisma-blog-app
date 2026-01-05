import { Post } from '../../../generated/prisma/client';
import { PostWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';

const createPost = async (
  data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const result = await prisma.post.create({
    data,
  });
  return result;
};

const getAllPosts = async ({
  search,
  tags,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  limit: number;
  page: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }
  const posts = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // count
  const totalCount = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
    data: posts,
  };
};

const getPostById = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  return post;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
};
