export const errorsName = {
  wrong_login: "wrong login",
  wrong_email: "wrong_email",
  confirm_code: "confirm_code",
  not_found_user: "not_found_user",
  not_found_deviceId: "not_found_deviceId",
  not_found_session: "not_found_session"
};
export const errorMap: Record<string, { message: string; field: string }> = {
  [errorsName.wrong_login]: {
    message: "login should be unique",
    field: "login"
  },
  [errorsName.wrong_email]: {
    message: "email should be unique",
    field: "email"
  },
  [errorsName.not_found_user]: {
    message: "email should be unique",
    field: "email"
  },
  [errorsName.confirm_code]: {
    message: "code error",
    field: "code"
  },
  [errorsName.not_found_deviceId]: {
    message: "code error",
    field: "code"
  }
};
