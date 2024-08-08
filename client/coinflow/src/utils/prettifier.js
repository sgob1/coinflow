const myTotal = function (amount, currency) {
  if (amount > 0) return `Your balance is ${prettyAmount(-amount)}${currency}`
  else return `Your balance is +${prettyAmount(-amount)}${currency}`
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

const userSentence = function (amount, currency, username) {
  if (amount < 0) {
    return `${username} owes you ${prettyAmount(-amount)}${currency}`
  } else if (amount > 0) {
    return `You owe ${username} ${prettyAmount(amount)}${currency}`
  } else {
    return `You are even with ${username}`
  }
}

const prettyNameString = function (username, name, surname) {
  return `${name} ${surname} (${username})`
}

const prettyAmount = function (amount) {
  return amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default {
  myTotal,
  myExpenses,
  prettySentence,
  userSentence
}
