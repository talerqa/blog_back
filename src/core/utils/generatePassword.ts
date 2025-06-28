const bcrypt = require("bcrypt");

export const generatePassword = async password => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};
