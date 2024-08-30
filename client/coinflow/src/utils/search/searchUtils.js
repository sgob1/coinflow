const sameDateISO8601 = function (string, year, month, day) {
  let split = string.split('-')
  return (
    Number(year) === Number(split[0]) &&
    Number(month) === Number(split[1]) &&
    Number(day) === Number(split[2])
  )
}

const searchFilters = {
  user: {
    apply: (ts, value) =>
      ts.filter((tr) => {
        if (value === '_total' || value === undefined) {
          return true
        }

        if (value === undefined) {
          return false
        }

        if (tr.quotas[value]) return true
        return false
      }),
    description: 'Finds transactions shared with specified user'
  },
  year: {
    apply: (ts, value) => ts.filter((t) => Number(t.year) === Number(value)),
    description: 'Filters with specified year'
  },
  month: {
    apply: (ts, value) => ts.filter((t) => Number(t.month) === Number(value)),
    description: 'Filters with specified month'
  },
  date: {
    apply: (ts, value) => ts.filter((t) => sameDateISO8601(value, t.year, t.month, t.day)),
    description: 'Filters with specified date having format YYYY-MM-DD'
  }
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

const applyFilters = function (transactions, searchFilters, structuredQuery) {
  for (let filter in searchFilters) {
    if (structuredQuery[filter] !== undefined) {
      transactions = searchFilters[filter].apply(transactions, structuredQuery[filter])
    }
  }
  return transactions
}

const generateSearchQuery = function (structuredQuery) {}

export default {
  searchFilters,
  parseQuery,
  applyFilters
}
