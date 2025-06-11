import { Blog } from "./blog";

export type BlogResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Blog[];
};
