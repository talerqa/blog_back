import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { BlogResponse } from "../types/blogResponse";
import { queryBlogRepo } from "./utils/queryRepo";
import { blogCollection } from "../../../db/mongo.db";
import { IMetaDataBlog } from "../types/IMetaDataBlog";
import { mapperPaging } from "../../../core/utils/mapperPaging";

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

  const blogs = await blogCollection
    .find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  const totalCount = await blogCollection.countDocuments(filter);

  const metaData: IMetaDataBlog = {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount
  };

  return mapperPaging.mapToBlogPaging(blogs, metaData);
};
