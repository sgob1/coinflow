const sameDateISO8601 = function (string, year, month, day) {
  let split = string.split('-')
  return year === split[0] && month === split[1] && day === split[2]
}

const searchFilters = {
  user: (ts, value, self, other) =>
    ts.filter((tr) => {
      if (other === '_total' || other === undefined) {
        return true
      }

      if (other === undefined) {
        return false
      }

      if (tr.quotas[other]) return true
      return false
    }),
  year: (ts, value) => ts.filter((t) => Number(t.year) === Number(value)),
  month: (ts, value) => ts.filter((t) => Number(t.month) === Number(value)),
  date: (ts, value) =>
    ts.filter((t) => sameDateISO8601(value, Number(t.year), Number(t.month), Number(t.day)))
}

const parseQuery = function (query) {
  let tokens = query
    .trim()
    .split(' ')
    .filter((s) => s.length > 0)

  let structuredQuery = {}
  let queryArray = []
  for (let token of tokens) {
    if (token.indexOf(':') > -1) {
      let keyVal = token.split(':')
      structuredQuery[keyVal[0]] = keyVal[1]
    } else {
      queryArray.push(token)
    }
  }
  structuredQuery.query = queryArray.join(' ')
  return structuredQuery
}

const applyFilters = function (transactions, searchFilters, structuredQuery, selfUsername) {
  for (let filter in searchFilters) {
    if (structuredQuery[filter] !== undefined) {
      transactions = searchFilters[filter](
        transactions,
        structuredQuery[filter],
        selfUsername,
        structuredQuery['user']
      )
    }
  }
  return transactions
}

export default {
  searchFilters,
  parseQuery,
  applyFilters
}
