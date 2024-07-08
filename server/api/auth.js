const router = require("express").Router();
const auth = require("../auth.js");
const users = require("../db/users.js");
const errors = require("../errors.js");
const usernameRegex = new RegExp("^([a-z0-9]{3,})$");

router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, surname } = req.body;
    if (!usernameRegex.test(username)) {
      res.status(409).json({ msg: `Wrong format for username '${username}'` });
      return;
    }
    const user = await users.findOne({ username });
    if (user) {
      res.status(409).json({ msg: `User '${user.username}' already existing` });
    } else {
      console.log(`User ${user} is requesting subscription`);
      let id = await computeUserId();
      const newUser = { id, username, password, name, surname };
      await users.insertOne(newUser);
      res.json({ msg: "User successfully registered" });
    }
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log({username, password})
    const user = await users.findPassword({ username });
    console.log(`User ${username} is attempting authentication`);
    if (user && user.password === password && user.username === username) {
      const data = { id: user.id, username: user.username };
      const token = auth.sign(data);
      res.cookie("jwt", token, { httpOnly: true });
      res.json({ msg: "User has been successfully authenticated" });
    } else {
      res.status(401).json({ msg: "Wrong username or password" });
    }
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

const computeUserId = async function () {
  const lastUser = await users.lastUser();
  return lastUser?.id !== undefined ? lastUser.id + 1 : 0;
};

module.exports = router;
