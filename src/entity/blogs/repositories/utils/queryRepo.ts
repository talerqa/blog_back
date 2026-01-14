import { SortFiledBlogs } from "../../../../core/types/sortFiledBlogs";
import { SortDirection } from "../../../../core/types/sortDesc";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { Blog } from "../../types/blog";

export class QueryBlogRepo {
  async getAllBlogs(
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
  }

  async getBlogById(blog: Blog): Promise<Blog> {
    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership
    };
  }
}

export const queryBlogRepo = new QueryBlogRepo();
