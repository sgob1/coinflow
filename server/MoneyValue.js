const BigDecimal = require("js-big-decimal");

class MoneyValue {
  #value;
  #scale;

  // workaround: for some reason calling the constructor directly does not
  // work, even when religiously following the documentation at the following
  // URL: https://github.com/royNiladri/js-big-decimal
  // A clean solution has been to simply provide big decimals from this module
  constructor(value = "0", scale = 2) {
    this.#scale = scale;
    this.#value = this.#parseBigDecimal(value);
  }

  #parseBigDecimal(str) {
    const num = Number(str);
    if (isNaN(num)) throw `Malformed ${str}, cannot parse to a valid number`;
    return new BigDecimal.default(str).round(this.#scale);
  }

  add(amount) {
    let moneyValue;
    if (!(amount instanceof MoneyValue))
      moneyValue = new MoneyValue(amount);
    else moneyValue = amount;
    this.#value = this.#value.add(moneyValue.getBigDecimal()).round(this.#scale);
  }

  sub(amount) {
    let moneyValue;
    if (!(amount instanceof MoneyValue))
      moneyValue = new MoneyValue(amount);
    else moneyValue = amount;
    this.#value = this.#value
      .subtract(moneyValue.getBigDecimal())
      .round(this.#scale);
  }

  getBigDecimal() {
    return this.#value.round(this.#scale);
  }

  getScale() {
    return this.#scale;
  }
  
  getValue() {
    return this.getBigDecimal().value;
  }

  toString() {
    return this.getValue().toString();
  }
}

module.exports = MoneyValue;
