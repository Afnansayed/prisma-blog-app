import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: { id: payload.postId },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: { id: payload.parentId },
    });
  }

  return await prisma.comment.create({
    data: payload,
  });
};

export const commentsService = {
  createComment,
};
