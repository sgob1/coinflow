const router = require("express").Router();

router.get("/search", function (req, res) {
  // TODO
  res.send(
    `Cerca l'utente che corrisponde alla stringa ${req.query.q.toLowerCase()}`
  );
});

module.exports = router;
