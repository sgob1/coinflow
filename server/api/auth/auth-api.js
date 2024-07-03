const router = require("express").Router();

router.post("/signup", function (req, res) {
  // TODO
  res.send("Registrazione di un nuovo utente");
});

router.post("/signin", function (req, res) {
  // TODO
  res.send("Login di un utente");
});

module.exports = router;
