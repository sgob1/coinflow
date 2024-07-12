const myTotal = function (amount) {
  if (amount < 0) {
    return `Your balance is ${-amount}`
  } else {
    return `Your balance is ${-amount}`
  }
}

const myExpenses = function (amount) {
  if (amount < 0) {
    return `You managed to receive ${-amount}`
  } else {
    return `Your expenses were ${amount}`
  }
}

const prettySentence = function (amount, username, name, surname) {
  if (amount < 0) {
    return `${prettyNameString(username, name, surname)} owes you ${-amount}`
  } else if (amount > 0) {
    return `You owe ${prettyNameString(username, name, surname)} ${amount}`
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
