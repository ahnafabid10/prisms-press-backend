import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./post.service";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const payload = req.body;

  const result = await postService.createPostInDB(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post created successfully",
    data: result,
  });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm, status, isFeatured, tags, authorId, page, limit, sortBy, sortOrder } =
    req.query;

  const filters = {
    searchTerm: searchTerm ? String(searchTerm) : undefined,
    status: status ? (status as any) : undefined,
    isFeatured: isFeatured !== undefined ? isFeatured === "true" : undefined,
    tags: tags ? (Array.isArray(tags) ? (tags as string[]) : [String(tags)]) : undefined,
    authorId: authorId ? String(authorId) : undefined,
  };

  const options = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy ? String(sortBy) : undefined,
    sortOrder: sortOrder ? (String(sortOrder) as "asc" | "desc") : undefined,
  };

  const result = await postService.getAllPostsFromDB(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePost = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await postService.getSinglePostFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id as string;
  const userRole = req.user?.role as string;
  const payload = req.body;

  const result = await postService.updatePostInDB(id, userId, userRole, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id as string;
  const userRole = req.user?.role as string;

  const result = await postService.deletePostInDB(id, userId, userRole);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: result,
  });
});

const getMyPosts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { page, limit, sortBy, sortOrder } = req.query;

  const options = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy ? String(sortBy) : undefined,
    sortOrder: sortOrder ? (String(sortOrder) as "asc" | "desc") : undefined,
  };

  const result = await postService.getMyPostsFromDB(userId, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My posts retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPostStats = catchAsync(async (req: Request, res: Response) => {
  const result = await postService.getPostStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post statistics retrieved successfully",
    data: result,
  });
});

export const postController = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  getMyPosts,
  getPostStats,
};
