const BigDecimal = require("js-big-decimal");
const SCALE = 2;

// workaround: for some reason calling the constructor directly does not
// work, even when religiously following the documentation at the following
// URL: https://github.com/royNiladri/js-big-decimal
// A clean solution has been to simply provide big decimals from this module
const bigDecimal = function (str) {
  if (!str) return new BigDecimal.default("0");

  const num = Number(str);
  if (isNaN(num)) throw `Malformed ${str}, cannot parse to a valid number`;
  return new BigDecimal.default(str);
};

const addAmount = function (n, m) {
  return n.add(m).round(SCALE);
};

const subAmount = function (n, m) {
  return n.subtract(m).round(SCALE);
};

module.exports = { bigDecimal, addAmount, subAmount };
