import { Comment } from "./comment";

export type CommentResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Comment[];
};
