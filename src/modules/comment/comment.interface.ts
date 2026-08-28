import { CommentStatus } from "../../../generated/prisma/enums.js";

export interface ICreateCommentInput {
  postId: string;
  content: string;
}

export interface IUpdateCommentInput {
  content?: string;
  status?: CommentStatus;
}
