const auth = require("../../auth.js");
const router = require("express").Router();
const db = require("../../db/dbhandler.js");
const USERS_COLLECTION = require("../../defaults.js").USERS_COLLECTION;

router.get("/search", async (req, res) => {
  if (!auth.isValid(req, res)) return;

  const user = await db.query((c) => c.findOne({ username: req.query.q.toLowerCase() }), USERS_COLLECTION);

  res.send(user);
});

module.exports = router;
