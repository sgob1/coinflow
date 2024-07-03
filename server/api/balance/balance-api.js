const router = require("express").Router();

router.get("/", function (req, res) {
  // TODO
  res.send("Visualizzazione riassunto dare/avere dell’utente loggato");
});

router.get("/:id", function (req, res) {
  // TODO
  res.send(
    `Visualizzazione del bilancio tra l’utente loggato e l’utente con id ${req.params.id}`
  );
});

module.exports = router;
