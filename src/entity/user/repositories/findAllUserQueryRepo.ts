import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { queryUserRepo } from "./utils/queryRepo";
import { IMetaData } from "../types/IMetaData";
import { UserResponse } from "../types/userResponse";
import { mapperPaging } from "../../../core/utils/mapperPaging";
import { UserModel } from "../domain/dto/user.entity";
import { User } from "../types/user";

export const findAllUserQueryRepo = async (
  query: PagingAndSortType
): Promise<UserResponse> => {
  const {
    pageSize,
    pageNumber,
    sortDirection,
    sortBy,
    filter,
    skip
  } = await queryUserRepo.getAllUsers(query);

  const users = (await UserModel.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(pageSize)
    .exec()) as User[];

  const totalCount = await UserModel.countDocuments(filter).exec();

  const metaData: IMetaData = {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount
  };

  return mapperPaging.mapToUserPaging(users, metaData);
};
