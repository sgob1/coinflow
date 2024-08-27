const budget = async function (year, month) {
  let fetchString = `/api/budget/`
  if (year) {
    fetchString = fetchString.concat('/', year)
    if (month) {
      fetchString = fetchString.concat('/', month)
    }
  }

  const response = await fetch(fetchString)
  if (response.ok) {
    return await response.json()
  } else {
    console.log(`Invalid response: ${response}`)
  }
}

const balance = async function (id) {
  let fetchString = '/api/balance'
  if (id) fetchString = fetchString.concat('/', id)

  const result = await fetch(fetchString)
  if (result.ok) {
    return await result.json()
  } else {
    console.log(`Cannot GET balance due to an error`)
  }
}

const usersSearch = async function (username) {
  let fetchString = `/api/users/search?q=${username}`

  const results = await fetch(fetchString)
  if (results.ok) {
    const users = await results.json()
    for (let item in users) {
      if (users[item].username === username) return users[item]
    }
    return users
  } else {
    console.log(`Cannot GET users due to ${results}`)
  }
}

const submitNewTransaction = async function (transaction) {
  let fetchString = `/api/budget/${transaction.year}/${transaction.month}`

  const results = await fetch(fetchString, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  })
  return results.json()
}

const submitEditedTransaction = async function (
  originalYear,
  originalMonth,
  originalId,
  transaction
) {
  let fetchString = `/api/budget/${originalYear}/${originalMonth}/${originalId}`

  const results = await fetch(fetchString, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  })
  return await results.json()
}

const deleteTransaction = async function (transaction) {
  let fetchString = `/api/budget/${transaction.year}/${transaction.month}/${transaction.transactionId}`

  const results = await fetch(fetchString, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  })
  return await results.json()
}

export default {
  budget,
  balance,
  usersSearch,
  submitNewTransaction,
  submitEditedTransaction,
  deleteTransaction
}
