import { prisma } from "../../lib/prisma";
import { ICreateCommentInput, IUpdateCommentInput } from "./comment.interface";

const createCommentInDB = async (authorId: string, payload: ICreateCommentInput) => {
  const { postId, content } = payload;

  const postExists = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!postExists) {
    throw new Error("Post not found");
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return comment;
};

const getCommentsByPostIdFromDB = async (postId: string) => {
  const postExists = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!postExists) {
    throw new Error("Post not found");
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};

const updateCommentInDB = async (
  commentId: string,
  userId: string,
  userRole: string,
  payload: IUpdateCommentInput
) => {
  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    throw new Error("Comment not found");
  }

  if (userRole !== "ADMIN" && existingComment.authorId !== userId) {
    throw new Error("You are not authorized to update this comment");
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedComment;
};

const deleteCommentInDB = async (
  commentId: string,
  userId: string,
  userRole: string
) => {
  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: {
        select: {
          authorId: true,
        },
      },
    },
  });

  if (!existingComment) {
    throw new Error("Comment not found");
  }

  const isCommentAuthor = existingComment.authorId === userId;
  const isPostAuthor = existingComment.post?.authorId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
    throw new Error("You are not authorized to delete this comment");
  }

  const deletedComment = await prisma.comment.delete({
    where: { id: commentId },
  });

  return deletedComment;
};

export const commentService = {
  createCommentInDB,
  getCommentsByPostIdFromDB,
  updateCommentInDB,
  deleteCommentInDB,
};
