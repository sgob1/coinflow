const errors = require("../../errors.js");
const jwt = require("jsonwebtoken");
const JWT_AUTH_SECRET = "This is a secret";
const EXPIRE_TIME = 86400;
const args = require("../../args.js");

const opt = args.parse();

let checkAuth = function (req, res) {
  if (typeof req.cookies.jwt === "undefined") {
    errors.unauthorizedAccess(req, res);
    return;
  }

  try {
    return jwt.verify(req.cookies.jwt, JWT_AUTH_SECRET);
  } catch (error) {
    errors.invalidJWTToken(error, res);
  }
};

let validAuth = function (req, res) {
  if (opt["noauth"])
    return true;

  const verifiedData = checkAuth(req, res);
  if (typeof verifiedData === "undefined") return false;
  else return true;
};

let sign = function (data) {
  return jwt.sign(data, JWT_AUTH_SECRET, { expiresIn: EXPIRE_TIME });
};

module.exports = {
  checkAuth,
  validAuth,
  sign,
};
