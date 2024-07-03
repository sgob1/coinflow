const express = require("express");
const apiRouter = express.Router();
const authRouter = require("./auth/auth-api.js");
const balanceRouter = require("./balance/balance-api.js");
const budgetRouter = require("./budget/budget-api.js");
const usersRouter = require("./users/users-api.js");

apiRouter.use("/auth", authRouter);
apiRouter.use("/balance", balanceRouter);
apiRouter.use("/budget", budgetRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
