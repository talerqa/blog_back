import { SortFiledBlogs } from "../../../core/types/sortFiledBlogs";
import { SortDirection } from "../../../core/types/sortDesc";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { WithId } from "mongodb";
import { Blog } from "../types/blog";

export const queryBlogRepo = {
  getAllBlogs: async function(
    query: PagingAndSortType
  ): Promise<{
    searchNameTerm: string | undefined;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
    skip: number;
    sortBy: SortFiledBlogs;
    filter: Partial<Record<SortFiledBlogs, {}>>;
  }> {
    const {
      searchNameTerm,
      pageNumber = 1,
      pageSize = 10,
      sortBy = SortFiledBlogs.CreatedAt,
      sortDirection = SortDirection.Desc
    } = query ?? {};

    const pageNum = +pageNumber;
    const size = +pageSize;
    const skip = (pageNum - 1) * size;

    const filter: Partial<Record<SortFiledBlogs, {}>> = {};

    if (!!searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    return {
      searchNameTerm,
      pageNumber: pageNum,
      pageSize: size,
      sortBy,
      sortDirection,
      skip,
      filter
    };
  },

  getBlogById: async function(blog: WithId<Blog>) {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership
    };
  }
};
