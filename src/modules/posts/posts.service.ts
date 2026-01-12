import { CommentStatus, Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { auth } from './../../lib/auth';

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">
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
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
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
   include: {
      _count: { select: { comments: true } }
    }
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
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          include: {
            replies: {
              orderBy: {
                createdAt: "asc",
              },
              where: {
                status: CommentStatus.APPROVED,
              },
              include: {
                replies: {
                  orderBy: {
                    createdAt: "asc",
                  },
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });
};

const getMyPosts = async(authorId: string) => {
     await prisma.user.findUniqueOrThrow({
        where: {
           id: authorId ,
           status: "ACTIVE"
         },
        select: { id: true}  
    });

    return await prisma.post.findMany({
        where: { authorId },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { comments: true } }
        }

    // const total = await prisma.post.aggregate({
    //     _count: {
    //         id: true
    //     },
    //     where: {
    //         authorId
    //     }
    // })
    })
};

const updatePosts = async(postId: string, data: Partial<Post> ,authorId: string, isAdmin: boolean) => {
     const existingPost = await prisma.post.findUniqueOrThrow({
        where: {
           id: postId,
         },
    });

    if (!isAdmin && existingPost.authorId !== authorId) {
        throw new Error("You are not authorized to update this post");
    }
    if(!isAdmin){
        delete data.isFeatured;
    }

    return await prisma.post.update({
        where: {
            id: postId,
        },
        data
    });
}

const deletePost = async (postId: string, isAdmin: boolean , authorId: string) => {
      const existingPost = await prisma.post.findUniqueOrThrow({
           where: {
            id: postId,
           }
      });

      if(!isAdmin && existingPost.authorId !== authorId){
        throw new Error("You are not authorized to delete this post");
      }

      return await prisma.post.delete({
        where: {
            id: postId,
        }
      })
}

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePosts,
  deletePost,
};
