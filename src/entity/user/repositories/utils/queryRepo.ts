import { SortFiledBlogs } from "../../../../core/types/sortFiledBlogs";
import { SortDirection } from "../../../../core/types/sortDesc";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";

export const queryUserRepo = {
  getAllUsers: async function(
    query: PagingAndSortType
  ): Promise<{
    searchEmailTerm: string | undefined;
    searchLoginTerm: string | undefined;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
    skip: number;
    sortBy: SortFiledBlogs;
    filter: Partial<Record<SortFiledBlogs, {}>> | any;
  }> {
    const {
      searchLoginTerm,
      searchEmailTerm,
      pageNumber = 1,
      pageSize = 10,
      sortBy = SortFiledBlogs.CreatedAt,
      sortDirection = SortDirection.Desc
    } = query ?? {};

    const pageNum = +pageNumber;
    const size = +pageSize;
    const skip = (pageNum - 1) * size;

    const filters: any = [];

    if (!!searchLoginTerm) {
      filters.push({ login: { $regex: searchLoginTerm, $options: "i" } });
    }

    if (!!searchEmailTerm) {
      filters.push({ email: { $regex: searchEmailTerm, $options: "i" } });
    }

    const filter = filters.length ? { $or: filters } : {};

    return {
      searchLoginTerm,
      searchEmailTerm,
      pageNumber: pageNum,
      pageSize: size,
      sortBy,
      sortDirection,
      skip,
      filter
    };
  }
};
