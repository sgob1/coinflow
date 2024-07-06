const BigDecimal = require("js-big-decimal");

const validYear = function (year) {
  return year && year >= 0;
};

const validMonth = function (month) {
  return month && 1 <= month && month <= 12;
};

const validDate = function (year, month, day) {
  return (
    year &&
    month &&
    day &&
    !isNaN(
      new Date(
        `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`
      )
    )
  );
};

const validId = function (id) {
  return id && typeof id === "number" && id >= 0;
};

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

module.exports = {
  validDate,
  validId,
  validMonth,
  validYear,
  bigDecimal,
  bigDecimal,
};
