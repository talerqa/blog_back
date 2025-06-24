import { Blog } from "../../../entity/blogs/types/blog";
import { BlogResponse } from "../../../entity/blogs/types/blogResponse";
import { IMetaDataBlog } from "../../../entity/blogs/types/IMetaDataBlog";
import { WithId } from "mongodb";

export const mapToBlogPaging = (
  blogs: WithId<Blog>[],
  metaData: IMetaDataBlog
): BlogResponse => {
  const items = blogs.map((blog: WithId<Blog>) => {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership ?? false
    };
  });
  return {
    items,
    page: metaData.page,
    pagesCount: metaData.pagesCount,
    pageSize: metaData.pageSize,
    totalCount: metaData.totalCount
  };
};
