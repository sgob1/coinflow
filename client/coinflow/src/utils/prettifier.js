const myTotal = function (amount, currency) {
  return `Your balance is ${-amount}${currency}`
}

const myExpenses = function (amount, currency) {
  if (amount < 0) {
    return `You managed to receive ${-amount}${currency}`
  } else {
    return `Your expenses were ${amount}${currency}`
  }
}

const prettySentence = function (amount, currency, username, name, surname) {
  if (amount < 0) {
    return `${prettyNameString(username, name, surname)} owes you ${-amount}${currency}`
  } else if (amount > 0) {
    return `You owe ${prettyNameString(username, name, surname)} ${amount}${currency}`
  } else {
    return `You are even with ${prettyNameString(username, name, surname)}`
  }
}

const prettyNameString = function (username, name, surname) {
  return `${name} ${surname} (${username})`
}

export default {
  myTotal,
  myExpenses,
  prettySentence
}
