const errors = require("./errors.js");
const jwt = require("jsonwebtoken");
const JWT_AUTH_SECRET = "This is a secret";
const EXPIRE_TIME = 86400;
const args = require("./args.js");

const opt = args.parse();

let checkAuth = function (req, res) {
  // In case of disabled auth,to get a valid authentication check and
  // impersonate a specific user, pass authentication params in request body
  if (opt["noauth"]) {
    return req.body;
  }

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

let sign = function (data) {
  return jwt.sign(data, JWT_AUTH_SECRET, { expiresIn: EXPIRE_TIME });
};

module.exports = {
  checkAuth,
  sign,
};
