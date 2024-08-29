const roundAmount = function (num) {
  return (Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2)
}

const computeTotalCost = function (transaction) {
  if (!transaction.quotas) return 0

  let totalCost = 0
  for (let quota in transaction.quotas) {
    totalCost = totalCost + Number(transaction.quotas[quota])
  }
  return this.roundAmount(totalCost)
}

const mutualTransactions = function (transactionsList, myUsername, theirUsername) {
  if (theirUsername === '') {
    return []
  }

  if (theirUsername === '_total') {
    return transactionsList
  }

  let filteredTransactions = []
  for (let transaction of transactionsList) {
    if (
      transaction.quotas[theirUsername] &&
      (transaction.author === myUsername || transaction.author === theirUsername)
    )
      filteredTransactions.push(transaction)
  }

  return filteredTransactions
}

export default {
  roundAmount,
  computeTotalCost,
  mutualTransactions
}
