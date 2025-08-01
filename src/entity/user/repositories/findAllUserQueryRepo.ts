import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { queryUserRepo } from "./utils/queryRepo";
import { userCollection } from "../../../db/mongo.db";
import { IMetaData } from "../types/IMetaData";
import { UserResponse } from "../types/userResponse";
import { mapToUserPaging } from "../../../core/utils/mappers/mapToUserPaging";

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

  const users = await userCollection
    .find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  const totalCount = await userCollection.countDocuments(filter);

  const metaData: IMetaData = {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount
  };

  return mapToUserPaging(users, metaData);
};
