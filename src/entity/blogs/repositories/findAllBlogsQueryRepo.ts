import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { BlogResponse } from "../types/blogResponse";
import { queryBlogRepo } from "./utils/queryRepo";
import { IMetaDataBlog } from "../types/IMetaDataBlog";
import { mapperPaging } from "../../../core/utils/mapperPaging";
import { BlogModel } from "../domain/dto/blog.entity";

export const findAllBlogsQueryRepo = async (
  query: PagingAndSortType
): Promise<BlogResponse> => {
  const {
    pageSize,
    pageNumber,
    sortDirection,
    sortBy,
    filter,
    skip
  } = await queryBlogRepo.getAllBlogs(query);

  const blogs = await BlogModel.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(pageSize)
    .exec();

  const totalCount = await BlogModel.countDocuments(filter).exec();

  const metaData: IMetaDataBlog = {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount
  };

  return mapperPaging.mapToBlogPaging(blogs, metaData);
};
