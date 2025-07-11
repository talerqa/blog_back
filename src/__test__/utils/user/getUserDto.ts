import { CreateUserInputModel } from "../../../entity/user/dto/createUserInputModel";

export function getUserDto(): CreateUserInputModel {
  return {
    login: "qwerty123",
    password: "qwerty321",
    email: "test@test.com"
  };
}
