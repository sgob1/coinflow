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
  if (id === 0)
    return true
  return id && typeof id === "number" && id >= 0;
};

module.exports = {
  validDate,
  validId,
  validMonth,
  validYear,
};
