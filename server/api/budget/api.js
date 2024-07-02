const router = require("express").Router();

router.get("/", function (req, res) {
  // TODO
  res.send("Spese dell’utente loggato");
});

router.get("/:year", function (req, res) {
  // TODO
  res.send(`Spese dell’utente loggato relative all’anno ${req.params.year}`);
});

module.exports = router;
