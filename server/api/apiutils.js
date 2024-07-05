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

const parseTotalCost = function (totalCost) {
  const numberTotalCost = Number(totalCost);
  if (isNaN(numberTotalCost)) throw `Malformed total cost '${totalCost}'`;
  return new BigDecimal.default(totalCost).round(2);
};

module.exports = {
  validDate,
  validId,
  validMonth,
  validYear,
  parseTotalCost,
};
