const internalServerError = (err, res) => {
  console.log(err);
  res.status(500).json({ msg: "Internal server error" });
};

module.exports = {
  internalServerError,
};
