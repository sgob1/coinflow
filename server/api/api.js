const express = require("express");
const apiRouter = express.Router();
const authRouter = require("./auth/api.js");
const balanceRouter = require("./balance/api.js");
const budgetRouter = require("./budget/api.js");
const usersRouter = require("./users/api.js");

apiRouter.use("/auth", authRouter);
//apiRouter.use("/balance", balanceRouter);
apiRouter.use("/budget", budgetRouter);
//apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
