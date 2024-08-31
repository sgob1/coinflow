const roundAmount = function (num) {
  return (Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2)
}

const computeTotalCost = function (transaction) {
  if (!transaction.quotas) return 0

  let totalCost = 0
  for (let quota in transaction.quotas) {
    if (
      typeof transaction.quotas[quota] === 'string' &&
      transaction.quotas[quota].indexOf(',') > -1
    ) {
      transaction.quotas[quota] = transaction.quotas[quota].replace(',', '.')
    }
    totalCost = totalCost + Number(transaction.quotas[quota])
  }
  return this.roundAmount(totalCost)
}

export default {
  roundAmount,
  computeTotalCost
}
