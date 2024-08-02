let jwt = require('jsonwebtoken');

const internalServerError = (err, res) => {
  console.log(err);
  res.status(500).json({ msg: "Internal server error" });
};

const unauthorizedAccess = (req, res) => {
  res
    .status(401)
    .json({ error: "AuthenticationError", message: "Unauthorized" });
  console.log(
    `Attempt from ${req.ip} to access resource ${req.baseUrl}${req.url}`
  );
};

const invalidJWTToken = (err, res) => {
  if (err instanceof jwt.TokenExpiredError) {
    res
      .status(401)
      .json({ error: "ExpiredJWTError", message: "Expired JWT token" });
  } else {
    res
      .status(401)
      .json({ error: "InvalidJWTError", message: "Invalid JWT token" });
  }
  return;
};

module.exports = {
  internalServerError,
  unauthorizedAccess,
  invalidJWTToken,
};
