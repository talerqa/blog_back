import { SortDirection } from "./sortDesc";
import { SortFiledBlogs } from "./sortFiledBlogs";

export type PagingAndSortType = {
  pageNumber: number;
  pageSize: number;
  sortBy: SortFiledBlogs;
  sortDirection: SortDirection;
  searchNameTerm: string;
};
