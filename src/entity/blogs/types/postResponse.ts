export type PostResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostResponse[];
};
