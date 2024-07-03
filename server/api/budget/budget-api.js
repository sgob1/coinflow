const router = require("express").Router();
const auth = require("../../auth.js");
const db = require("../../db/dbhandler.js");
const defaults = require("../../defaults.js");

router.get("/", function (req, res) {
  // TODO
  res.send("Spese dell’utente loggato");
});

router.get("/search", function (req, res) {
  // TODO
});

router.get("/whoami", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  console.log(verifiedData);
  if (typeof verifiedData === "undefined") return;

  const user = await db.query(
    (c) => c.findOne({ username: verifiedData.username }),
    defaults.USERS_COLLECTION
  );

  console.log(user);

  res.status(200).json(user);
});

router.get("/:year", function (req, res) {
  // TODO
  res.send(`Spese dell’utente loggato relative all’anno ${req.params.year}`);
});

router.get("/:year/:month", function (req, res) {
  // TODO
  res.send(
    `Spese dell’utente loggato relative al mese ${req.params.month} dell’anno ${req.params.year}`
  );
});

router.get("/:year/:month/:id", function (req, res) {
  // TODO
  res.send(
    `Dettaglio della spesa ${req.params.id} nel mese ${req.params.month} dell’anno ${req.params.year}`
  );
});

router.post("/:year/:month", function (req, res) {
  // TODO
  res.send(
    `Aggiunta di una spesa nel mese ${req.params.month} dell’anno ${req.params.year}`
  );
});

router.put("/:year/:month/:id", function (req, res) {
  // TODO
  res.send(
    `Modifica della spesa ${req.params.id} nel mese ${req.params.month} dell’anno ${req.params.year}`
  );
});

router.delete("/:year/:month/:id", function (req, res) {
  // TODO
  res.send(
    `Rimozione della spesa ${req.params.id} nel mese ${req.params.month} dell’anno ${req.params.year}`
  );
});

module.exports = router;
