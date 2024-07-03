const router = require("express").Router();

router.get("/", function (req, res) {
  // TODO
  res.send("Spese dell’utente loggato");
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
