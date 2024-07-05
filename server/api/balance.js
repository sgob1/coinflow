const router = require("express").Router();
const auth = require("../auth.js");
const users = require("../db/users.js");
const transactions = require("../db/transactions.js");

// Balance for logged user
router.get("/", function (req, res) {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  let year, month, day;
  try {
    year = req.body.year ? Number(req.body.year) : undefined;
    month = req.body.month ? Number(req.body.month) : undefined;
    day = req.body.day ? Number(req.body.day) : undefined;
    if (!validDate(year, month, day)) {
      res.status(400).json({ msg: "Invalid date in request body" });
      return;
    }
  } catch (err) {
    console.log(err);
    console.log("ERROR: Illegal date computation, invalid date fields");
    res.status(400).json({ msg: err });
    return;
  }

  let results = await transactions.findOfUser()
});

router.get("/:id", function (req, res) {
  // TODO
  res.send(
    `Visualizzazione del bilancio tra l’utente loggato e l’utente con id ${req.params.id}`
  );
});

module.exports = router;
