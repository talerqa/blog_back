import { User } from "./user";

export type UserResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Omit<User, "password" | "passwordRecovery">[];
};
