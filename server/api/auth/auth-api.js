const router = require("express").Router();
const auth = require("../../auth.js");
const db = require("../../db/dbhandler.js");
const USERS_COLLECTION = require("../../defaults.js").USERS_COLLECTION;
const errors = require("../../errors.js");

router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, surname } = req.body;
    const user = await db.query(
      (c) => c.findOne({ username }),
      USERS_COLLECTION
    );
    if (user) {
      res.status(409).json({ msg: `User '${user.username}' already existing` });
    } else {
      console.log(`User ${user} is requesting subscription`);
      let id = computeId(db);
      const newUser = { id, username, password, name, surname };
      await db.query((c) => c.insertOne(newUser), USERS_COLLECTION);
      res.json({ msg: "User successfully registered" });
    }
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.query(
      (c) => c.findOne({ username }),
      USERS_COLLECTION
    );
    console.log(`User ${user.username} is attempting authentication`);
    if (user && user.password === password && user.username === username) {
      const data = { id: user.id };
      const token = auth.sign(data);
      res.cookie("token", token, { httpOnly: true });
      res.json({ msg: "User has been successfully authenticated" });
    } else {
      res.status(401).json({ msg: "Wrong username or password" });
    }
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

const computeId = async function (db) {
  const lastUser = await db.query(
    (c) => c.findOne({}, { sort: { id: -1 } }),
    USERS_COLLECTION
  );
  return lastUser?.id !== undefined ? lastUser.id + 1 : 0;
};

module.exports = router;
