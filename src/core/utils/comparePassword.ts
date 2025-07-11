const bcrypt = require("bcrypt");

export const comparePassword = async (
  password: string,
  userPassword: string
) => {
  return bcrypt.compare(password, userPassword);
};
