import { IMetaDataBlog } from "../../../entity/blogs/types/IMetaDataBlog";
import { WithId } from "mongodb";
import { User } from "../../../entity/user/types/user";
import { UserResponse } from "../../../entity/user/types/userResponse";

export const mapToUserPaging = (
  users: WithId<Omit<User, "password">>[],
  metaData: IMetaDataBlog
): UserResponse => {
  const items = users.map(blog => {
    return {
      id: blog._id.toString(),
      login: blog.login,
      email: blog.email,
      createdAt: blog.createdAt,
      emailConfirmation: blog.emailConfirmation
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
