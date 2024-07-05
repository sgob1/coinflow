const express = require("express");
const apiRouter = express.Router();
const authRouter = require("./auth.js");
const balanceRouter = require("./balance.js");
const budgetRouter = require("./budget.js");
const usersRouter = require("./users.js");

apiRouter.use("/auth", authRouter);
apiRouter.use("/balance", balanceRouter);
apiRouter.use("/budget", budgetRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
