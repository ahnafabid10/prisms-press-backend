import { PostStatus } from "../../../generated/prisma/enums";

export interface IPostFilterOptions {
  searchTerm?: string;
  status?: PostStatus;
  isFeatured?: boolean;
  tags?: string[];
  authorId?: string;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ICreatePostInput {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags?: string[];
}

export interface IUpdatePostInput {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags?: string[];
}
