import { Post } from "../../posts/types/post";

export type PostResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Post[];
};
