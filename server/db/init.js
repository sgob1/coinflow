const users = require("./users.js");
const transactions = require("./transactions.js");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

let idNumbers = {}
const submitTransaction = async function(transaction) {
  let month = transaction.month
  let author = transaction.author
  if (!idNumbers[month]) {
    idNumbers[month] = 0
  } 

  if (transaction.quotas[author] === undefined) {
    console.log(`undefined quota for transaction ${transaction}`)
  }

  transaction.transactionId = idNumbers[month]
  idNumbers[month] = idNumbers[month] + 1
  await transactions.insertOne(transaction)
}

const resetDb = async function () {
  users.removeAll();
  transactions.removeAll();
  const johnHash = bcrypt.hashSync("b31ngj0hnm4lk0v1ch", SALT_ROUNDS);
  const juliaHash = bcrypt.hashSync("prettywoman14", SALT_ROUNDS);
  const clooneyHash = bcrypt.hashSync("ImTheBestBatman!", SALT_ROUNDS);
  const diCaprioHash = bcrypt.hashSync("iFinallyGotTheOscar", SALT_ROUNDS);
  const deNiroHash = bcrypt.hashSync("YouTalkingToMe?", SALT_ROUNDS);
  const mrobbieHash = bcrypt.hashSync("ImaBarbieGirl", SALT_ROUNDS);

  const john = {
    id: 0,
    username: "john",
    passwordHash: johnHash,
    name: "John",
    surname: "Malkovich",
  };
  const julia = {
    id: 1,
    username: "jroberts",
    passwordHash: juliaHash,
    name: "Julia",
    surname: "Roberts",
  };
  const clooney = {
    id: 2,
    username: "clooney",
    passwordHash: clooneyHash,
    name: "George",
    surname: "Clooney",
  };
  const leo = {
    id: 3,
    username: "leo",
    passwordHash: diCaprioHash,
    name: "Leonardo",
    surname: "Di Caprio",
  };
  const deniro = {
    id: 4,
    username: "deniro",
    passwordHash: deNiroHash,
    name: "Robert",
    surname: "De Niro",
  };
  const mrobbie = {
    id: 5,
    username: "mrobbie",
    passwordHash: mrobbieHash,
    name: "Margot",
    surname: "Robbie",
  };
  await users.insertOne(john);
  await users.insertOne(julia);
  await users.insertOne(clooney);
  await users.insertOne(leo);
  await users.insertOne(deniro);
  await users.insertOne(mrobbie);

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 7,
    day: 1,
    description: "Initial budget",
    category: "initial",
    quotas: { john: -10644.23 },
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 1,
    description: "Initial budget",
    category: "initial",
    quotas: { jroberts: -7443.33 },
  })

  await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 7,
    day: 1,
    description: "Initial budget",
    category: "initial",
    quotas: { clooney: -12421.83 },
  })

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 7,
    day: 1,
    description: "Initial budget",
    category: "initial",
    quotas: { leo: -10000.00 },
  })

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 7,
    day: 1,
    description: "Initial budget",
    category: "initial",
    quotas: { deniro: -6734.66 },
  })

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 7,
    day: 1,
    description: "Initial budget",
    category: "initial",
    quotas: { mrobbie: -17571.17 },
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 25,
    description: "Netflix subscription July",
    category: "internet",
    quotas: { john: 9.33, clooney: 9.33, jroberts: 9.33 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 8,
    day: 25,
    description: "Netflix subscription August",
    category: "internet",
    quotas: { john: 10.33, clooney: 10.33, jroberts: 10.33 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 9,
    day: 25,
    description: "Netflix subscription September",
    category: "internet",
    quotas: { john: 10.33, clooney: 10.33, jroberts: 10.33 },
  });

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 7,
    day: 5,
    description: "Birthday shopping",
    category: "shopping",
    quotas: { john: 120.0 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 3,
    description: "Birthday present for John Malkovich",
    category: "shopping",
    quotas: { jroberts: 45.0, clooney: 44.99 },
  });

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 7,
    day: 11,
    description: "YouTube Music subscription July",
    category: "internet",
    quotas: { john: 3.99, jroberts: 4, deniro: 4.0 },
  });
  await submitTransaction({
    author: "john",
    year: 2024,
    month: 8,
    day: 11,
    description: "YouTube Music subscription August",
    category: "internet",
    quotas: { john: 3.99, jroberts: 4, deniro: 4.0 },
  })  
  await submitTransaction({
    author: "john",
    year: 2024,
    month: 9,
    day: 11,
    description: "YouTube Music subscription September",
    category: "internet",
    quotas: { john: 3.99, jroberts: 4, deniro: 4.0 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 17,
    description: "Drink with friends",
    category: "relax",
    quotas: { jroberts: 17.0 , mrobbie: -8.0},
  });

await submitTransaction({
    author: "john",
    year: 2024,
    month: 7,
    day: 2,
    description: "Gasoline",
    category: "car",
    quotas: { john: 60.0 },
  });

await submitTransaction({
    author: "leo",
    year: 2024,
    month: 7,
    day: 21,
    description: "Gasoline",
    category: "car",
    quotas: { leo: 54.33 },
  });

await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 8,
    day: 6,
    description: "Gasoline",
    category: "car",
    quotas: { clooney: 39.18 },
  });

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 9,
    day: 4,
    description: "Refund for past bill",
    category: "refunds",
    quotas: { mrobbie: -41.5, leo: 41.5 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 13,
    description: "Refund for past bill",
    category: "bills",
    quotas: { jroberts: 33.19, deniro: -33.19 },
  });

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 8,
    day: 14,
    description: "Shopping at the supermarket",
    category: "food",
    quotas: { leo: 80.00, clooney: 17.33 },
  });

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 8,
    day: 9,
    description: "Shopping at the groceries",
    category: "food",
    quotas: { john: 24.50 },
  });

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 7,
    day: 6,
    description: "Barber",
    category: "selfcare",
    quotas: { john: 19.00 },
  });

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 8,
    day: 12,
    description: "Barber",
    category: "selfcare",
    quotas: { john: 19.00 },
  });

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 9,
    day: 13,
    description: "Barber",
    category: "selfcare",
    quotas: { john: 19.00 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 23,
    description: "Hairdresser",
    category: "selfcare",
    quotas: { jroberts: 50.00 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 8,
    day: 25,
    description: "Hairdresser",
    category: "selfcare",
    quotas: { jroberts: 50.00 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 9,
    day: 21,
    description: "Hairdresser",
    category: "selfcare",
    quotas: { jroberts: 52.00 },
  });

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 7,
    day: 16,
    description: "Rent",
    category: "rent",
    quotas: { mrobbie: 316.66, jroberts: 316.66, leo: 316.66 },
  });

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 8,
    day: 16,
    description: "Rent",
    category: "rent",
    quotas: { mrobbie: 316.66, jroberts: 316.66, leo: 316.66 },
  });

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 9,
    day: 16,
    description: "Rent",
    category: "rent",
    quotas: { mrobbie: 316.66, jroberts: 316.66, leo: 316.66 },
  });

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 7,
    day: 1,
    description: "Rent",
    category: "rent",
    quotas: { john: 400, clooney: 400.00, deniro: 400.00 },
  });

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 8,
    day: 1,
    description: "Rent",
    category: "rent",
    quotas: { john: 400, clooney: 400.00, deniro: 400.00 },
  });

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 9,
    day: 1,
    description: "Rent",
    category: "rent",
    quotas: { john: 400, clooney: 400.00, deniro: 400.00 },
  });

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 7,
    day: 19,
    description: "Energy bill July",
    category: "bills",
    quotas: { john: 41.57, clooney: 41.57, deniro: 41.57 },
  });

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 9,
    day: 19,
    description: "Energy bill September",
    category: "bills",
    quotas: { john: 33.02, clooney: 33.02, deniro: 33.02 },
  });

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 8,
    day: 13,
    description: "Gas bill August",
    category: "bills",
    quotas: { john: 19.73, clooney: 19.73, deniro: 19.73 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 8,
    day: 16,
    description: "Energy bill August",
    category: "bills",
    quotas: { mrobbie: 31.89, jroberts: 31.89, leo: 31.89 },
  });

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 7,
    day: 3,
    description: "Pay July",
    category: "pay",
    quotas: { john: -1500.00 },
  });

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 8,
    day: 3,
    description: "Pay August",
    category: "pay",
    quotas: { john: -1500.00 },
  });

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 9,
    day: 3,
    description: "Pay September",
    category: "pay",
    quotas: { john: -1500.00 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 3,
    description: "Pay July",
    category: "pay",
    quotas: { jroberts: -1800.00 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 8,
    day: 3,
    description: "Pay August",
    category: "pay",
    quotas: { jroberts: -1800.00 },
  });

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 9,
    day: 3,
    description: "Pay September",
    category: "pay",
    quotas: { jroberts: -1800.00 },
  });

  await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 7,
    day: 3,
    description: "Pay July",
    category: "pay",
    quotas: { clooney: -1600.00 },
  });

  await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 8,
    day: 3,
    description: "Pay August",
    category: "pay",
    quotas: { clooney: -1600.00 },
  });

  await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 9,
    day: 3,
    description: "Pay September",
    category: "pay",
    quotas: { clooney: -1600.00 },
  });

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 7,
    day: 3,
    description: "Pay July",
    category: "pay",
    quotas: { leo: -2000.00 },
  });

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 8,
    day: 3,
    description: "Pay August",
    category: "pay",
    quotas: { leo: -2000.00 },
  });

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 9,
    day: 3,
    description: "Pay September",
    category: "pay",
    quotas: { leo: -2000.00 },
  });

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 7,
    day: 3,
    description: "Pay July",
    category: "pay",
    quotas: { deniro: -1900.00 },
  });

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 8,
    day: 3,
    description: "Pay August",
    category: "pay",
    quotas: { deniro: -1900.00 },
  });

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 9,
    day: 3,
    description: "Pay September",
    category: "pay",
    quotas: { deniro: -1900.00 },
  });

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 7,
    day: 3,
    description: "Pay July",
    category: "pay",
    quotas: { mrobbie: -2100.00 },
  });

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 8,
    day: 3,
    description: "Pay August",
    category: "pay",
    quotas: { mrobbie: -2100.00 },
  });

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 9,
    day: 3,
    description: "Pay September",
    category: "pay",
    quotas: { mrobbie: -2100.00 },
  });

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 8,
    day: 2,
    description: "Food shopping",
    category: "food",
    quotas: { mrobbie: 57.98 },
  })

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 7,
    day: 21,
    description: "Food shopping",
    category: "food",
    quotas: { mrobbie: 126.73 },
  })

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 9,
    day: 14,
    description: "Food shopping",
    category: "food",
    quotas: { mrobbie: 146.46 },
  })

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 8,
    day: 15,
    description: "Drink with friends",
    category: "relax",
    quotas: { mrobbie: 10 },
  })

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 8,
    day: 15,
    description: "Pizza with friends",
    category: "relax",
    quotas: { mrobbie: 14 },
  })

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 9,
    day: 3,
    description: "Restaurant with coworkers",
    category: "relax",
    quotas: { mrobbie: 36 },
  })

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 9,
    day: 18,
    description: "Food shopping",
    category: "food",
    quotas: { mrobbie: 31.51 },
  })

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 8,
    day: 10,
    description: "Amazon Prime subscription August",
    category: "internet",
    quotas: { mrobbie: 7.99, jroberts: 8.00, leo: 8.00, deniro: 8.00},
  })

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 7,
    day: 10,
    description: "Amazon Prime subscription July",
    category: "internet",
    quotas: { mrobbie: 7.99, jroberts: 8.00, leo: 8.00, deniro: 8.00},
  })

  await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 9,
    day: 10,
    description: "Amazon Prime subscription September",
    category: "internet",
    quotas: { mrobbie: 7.99, jroberts: 8.00, leo: 8.00, deniro: 8.00},
  })

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 7,
    day: 13,
    description: "Disney Plus subscription July",
    category: "internet",
    quotas: { john: 3.99, leo: 4.00, deniro: 4.00},
  })

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 8,
    day: 13,
    description: "Disney Plus subscription August",
    category: "internet",
    quotas: { john: 3.99, leo: 4.00, deniro: 4.00},
  })

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 9,
    day: 13,
    description: "Disney Plus subscription September",
    category: "internet",
    quotas: { john: 3.99, leo: 4.00, deniro: 4.00},
  })

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 8,
    day: 20,
    description: "Travel to Spain",
    category: "holiday",
    quotas: { john: 2400.00, jroberts: 2400.00 },
  })

  await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 8,
    day: 17,
    description: "Travel to Malta",
    category: "holiday",
    quotas: { clooney: 2123.00 },
  })

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 8,
    day: 17,
    description: "Travel to Portugal",
    category: "holiday",
    quotas: { leo: 3299.00 },
  })

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 7,
    day: 10,
    description: "Food shopping",
    category: "food",
    quotas: {john: 132.74},
  })

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 7,
    day: 24,
    description: "Food shopping",
    category: "food",
    quotas: {john: 97.64},
  })

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 8,
    day: 10,
    description: "Food shopping",
    category: "food",
    quotas: {john: 165.54},
  })

  await submitTransaction({
    author: "john",
    year: 2024,
    month: 9,
    day: 2,
    description: "Food shopping",
    category: "food",
    quotas: {john: 101.02},
  })

  await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 7,
    day: 10,
    description: "Food shopping",
    category: "food",
    quotas: {clooney: 136.74},
  })

  await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 7,
    day: 24,
    description: "Food shopping",
    category: "food",
    quotas: {clooney: 87.64},
  })

  await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 8,
    day: 10,
    description: "Food shopping",
    category: "food",
    quotas: {clooney: 168.54},
  })

  await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 9,
    day: 2,
    description: "Food shopping",
    category: "food",
    quotas: {clooney: 97.02},
  })

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 7,
    day: 12,
    description: "Food shopping",
    category: "food",
    quotas: {leo: 124.74},
  })

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 7,
    day: 22,
    description: "Food shopping",
    category: "food",
    quotas: {leo: 87.84},
  })

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 8,
    day: 5,
    description: "Food shopping",
    category: "food",
    quotas: {leo: 170.57},
  })

  await submitTransaction({
    author: "leo",
    year: 2024,
    month: 9,
    day: 6,
    description: "Food shopping",
    category: "food",
    quotas: {leo: 92.02},
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 12,
    description: "Food shopping",
    category: "food",
    quotas: {jroberts: 86.74, deniro: 45.44},
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 22,
    description: "Food shopping",
    category: "food",
    quotas: {jroberts: 78.66, deniro: 49.59},
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 8,
    day: 5,
    description: "Food shopping",
    category: "food",
    quotas: {jroberts: 170.57},
  })

  await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 8,
    day: 11,
    description: "Food shopping",
    category: "food",
    quotas: {deniro: 98.17},
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 9,
    day: 6,
    description: "Food shopping",
    category: "food",
    quotas: {jroberts: 18.66, deniro: 127.59},
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 8,
    day: 4,
    description: "Car tax",
    category: "car",
    quotas: {jroberts: 204.55},
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 8,
    day: 9,
    description: "Car wash",
    category: "car",
    quotas: {jroberts: 8},
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 1,
    description: "Gasoline",
    category: "car",
    quotas: {jroberts: 71.66},
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 8,
    day: 7,
    description: "Gasoline",
    category: "car",
    quotas: {jroberts: 67.12},
  })

  await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 9,
    day: 12,
    description: "Gasoline",
    category: "car",
    quotas: {jroberts: 69.23},
  })

await submitTransaction({
    author: "john",
    year: 2024,
    month: 9,
    day: 8,
    description: "Gasoline",
    category: "car",
    quotas: { john: 61.33 },
  });

await submitTransaction({
    author: "leo",
    year: 2024,
    month: 8,
    day: 7,
    description: "Clothes",
    category: "shopping",
    quotas: { leo: 175.00 },
  });

await submitTransaction({
    author: "jroberts",
    year: 2024,
    month: 7,
    day: 18,
    description: "Clothes",
    category: "shopping",
    quotas: { jroberts: 89.97 },
  });

await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 9,
    day: 11,
    description: "Shoes",
    category: "shopping",
    quotas: { deniro: 29.99 },
  });

await submitTransaction({
    author: "mrobbie",
    year: 2024,
    month: 8,
    day: 27,
    description: "Shoes",
    category: "shopping",
    quotas: { mrobbie: 59.99 },
  });

await submitTransaction({
    author: "leo",
    year: 2024,
    month: 7,
    day: 22,
    description: "Restaurant with coworkers",
    category: "relax",
    quotas: { leo: 52.50 },
  });

await submitTransaction({
    author: "deniro",
    year: 2024,
    month: 7,
    day: 29,
    description: "Restaurant with friends",
    category: "relax",
    quotas: { deniro: 22.00 },
  });

await submitTransaction({
    author: "clooney",
    year: 2024,
    month: 8,
    day: 24,
    description: "New smartphone",
    category: "tech",
    quotas: {clooney: 419.99 },
  });
};

module.exports = resetDb;
