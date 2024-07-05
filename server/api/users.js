const auth = require("../auth.js");
const router = require("express").Router();
const users = require("../db/users.js");

router.get("/search", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  const user = await users.findOne({ username: req.query.q.toLowerCase() });

  res.send(user);
});

module.exports = router;
