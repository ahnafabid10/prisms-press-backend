import { prisma } from "../../lib/prisma";
import { ICreatePostInput, IPostFilterOptions, IPaginationOptions, IUpdatePostInput } from "./post.interface";
import { Prisma } from "../../../generated/prisma/client";

const createPostInDB = async (authorId: string, payload: ICreatePostInput) => {
  const post = await prisma.post.create({
    data: {
      ...payload,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return post;
};

const getAllPostsFromDB = async (
  filters: IPostFilterOptions,
  options: IPaginationOptions
) => {
  const { searchTerm, status, isFeatured, tags, authorId } = filters;
  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = options;

  const pageNum = Number(page) > 0 ? Number(page) : 1;
  const limitNum = Number(limit) > 0 ? Number(limit) : 10;
  const skip = (pageNum - 1) * limitNum;

  const andConditions: Prisma.PostWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { content: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (isFeatured !== undefined) {
    const isFeaturedBool = String(isFeatured) === "true";
    andConditions.push({ isFeatured: isFeaturedBool });
  }

  if (authorId) {
    andConditions.push({ authorId });
  }

  if (tags) {
    const tagList = Array.isArray(tags) ? tags : [tags];
    andConditions.push({
      tags: {
        hasSome: tagList,
      },
    });
  }

  const whereConditions: Prisma.PostWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const posts = await prisma.post.findMany({
    where: whereConditions,
    skip,
    take: limitNum,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  const total = await prisma.post.count({
    where: whereConditions,
  });

  return {
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
    },
    data: posts,
  };
};

const getSinglePostFromDB = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // Increment view count
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return updatedPost;
};

const updatePostInDB = async (
  postId: string,
  userId: string,
  userRole: string,
  payload: IUpdatePostInput
) => {
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  if (userRole !== "ADMIN" && existingPost.authorId !== userId) {
    throw new Error("You are not authorized to update this post");
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
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

  return updatedPost;
};

const deletePostInDB = async (postId: string, userId: string, userRole: string) => {
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  if (userRole !== "ADMIN" && existingPost.authorId !== userId) {
    throw new Error("You are not authorized to delete this post");
  }

  const deletedPost = await prisma.post.delete({
    where: { id: postId },
  });

  return deletedPost;
};

const getMyPostsFromDB = async (userId: string, options: IPaginationOptions) => {
  return getAllPostsFromDB({ authorId: userId }, options);
};

export const postService = {
  createPostInDB,
  getAllPostsFromDB,
  getSinglePostFromDB,
  updatePostInDB,
  deletePostInDB,
  getMyPostsFromDB,
};
