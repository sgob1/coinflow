const auth = require("../auth.js");
const router = require("express").Router();
const users = require("../db/users.js");

router.get("/search", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  const usersResults = await users.search(req.query.q);

  if (usersResults.length > 0) {
    res.status(200).json(usersResults);
  } else {
    res.status(404).json({ msg: "No username matches the pattern" });
  }
});

module.exports = router;
