import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { IMetaDataBlog } from "../types/IMetaDataBlog";
import { PostResponse } from "../types/postResponse";
import { SortFiledBlogs } from "../../../core/types/sortFiledBlogs";
import { SortDirection } from "../../../core/types/sortDesc";
import { findBlogById } from "./findBlogByIdQueryRepo";
import { mapperPaging } from "../../../core/utils/mapperPaging";
import { PostModel } from "../../posts/domain/dto/post.entity";

export const findPostsByBlogId = async (
  blogId: string,
  query: PagingAndSortType,
  userId: string
): Promise<PostResponse | null> => {
  const {
    pageNumber = 1,
    pageSize = 10,
    sortBy = SortFiledBlogs.CreatedAt,
    sortDirection = SortDirection.Desc
  } = query ?? {};

  const skip = (+pageNumber - 1) * +pageSize;

  const blog = await findBlogById(blogId);

  if (!blog) {
    return null;
  }

  const postsById = await PostModel.find({ blogId })
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(+pageSize)
    .exec();

  if (!postsById) {
    return null;
  }

  const totalCount = await PostModel.countDocuments({ blogId }).exec();

  const metaData: IMetaDataBlog = {
    pagesCount: Math.ceil(+totalCount / +pageSize),
    page: +pageNumber,
    pageSize: +pageSize,
    totalCount
  };

  return mapperPaging.mapToPostPaging(postsById, metaData, userId);
};
