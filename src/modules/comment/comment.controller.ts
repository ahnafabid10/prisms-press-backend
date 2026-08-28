import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { commentService } from "./comment.service";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const payload = req.body;

  const result = await commentService.createCommentInDB(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment created successfully",
    data: result,
  });
});

const getCommentsByPostId = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId as string;

  const result = await commentService.getCommentsByPostIdFromDB(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comments retrieved successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id as string;
  const userRole = req.user?.role as string;
  const payload = req.body;

  const result = await commentService.updateCommentInDB(id, userId, userRole, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id as string;
  const userRole = req.user?.role as string;

  const result = await commentService.deleteCommentInDB(id, userId, userRole);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully",
    data: result,
  });
});

export const commentController = {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
};
