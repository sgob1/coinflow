const router = require("express").Router();
const jwt = require("jsonwebtoken");
const db = require("../../db/dbhandler.js");
const USERS_COLLECTION = require("../../defaults.js").USERS_COLLECTION;
const JWT_AUTH_SECRET = "This is a secret";
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
      const lastUser = await db.query(
        (c) => c.findOne({}, { sort: { id: -1 } }),
        USERS_COLLECTION
      );
      let id = lastUser?.id !== undefined ? lastUser.id + 1 : 0;
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
      const token = jwt.sign(data, JWT_AUTH_SECRET, { expiresIn: 86400 });
      res.cookie("token", token, { httpOnly: true });
      res.json({ msg: "User has been successfully authenticated" });
    } else {
      res.status(401).json({ msg: "Wrong username or password" });
    }
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

module.exports = router;
