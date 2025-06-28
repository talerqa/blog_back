import { IMetaDataBlog } from "../../../entity/blogs/types/IMetaDataBlog";
import { WithId } from "mongodb";
import { User } from "../../../entity/user/types/user";
import { UserResponse } from "../../../entity/user/types/postResponse";

export const mapToUserPaging = (
  users: WithId<User>[],
  metaData: IMetaDataBlog
): UserResponse => {
  const items = users.map((blog: WithId<User>) => {
    return {
      id: blog._id.toString(),
      login: blog.login,
      email: blog.email,
      createdAt: blog.createdAt
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
