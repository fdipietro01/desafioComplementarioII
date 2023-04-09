const jwt = require("jsonwebtoken");

const sign = process.env.JWT_SECRET;
const generateToken = (user) => {
  const token = jwt.sign(user, sign, { expiresIn: "12h" });
  return token;
};

module.exports = { generateToken };
