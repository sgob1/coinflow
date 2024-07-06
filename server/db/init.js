const users = require("./users.js");
const transactions = require("./transactions.js");

const resetDb = async function () {
  users.removeAll();
  transactions.removeAll();

  const john = {
    id: 0,
    username: "john",
    password: "notapass",
    name: "John",
    surname: "Malkovich",
  };
  const mary = {
    id: 1,
    username: "mary",
    password: "flowerrose",
    name: "Mary",
    surname: "Ann Foster",
  };
  const james = {
    id: 2,
    username: "james",
    password: "123456",
    name: "James",
    surname: "Gunn",
  };
  await users.insertOne(john);
  await users.insertOne(mary);
  await users.insertOne(james);

  const johnShopping = {
    transactionId: 0,
    author: "john",
    year: 2024,
    month: 7,
    day: 5,
    description: "Birthday shopping",
    category: "shopping",
    totalCost: 120.0,
  };
  const maryJamesBirthdayPresent = {
    transactionId: 1,
    author: "mary",
    year: 2024,
    month: 7,
    day: 3,
    description: "Birthday present for John",
    category: "shopping",
    totalCost: 89.99,
    quotas: { mary: 45.0, james: 44.99 },
  };
  const netflix = {
    transactionId: 0,
    author: "james",
    year: 2024,
    month: 6,
    day: 25,
    description: "Netflix subscription",
    category: "internet",
    totalCost: 27.99,
    quotas: { john: 9.33, mary: 9.33, james: 9.33 },
  };
  const ytmusic = {
    transactionId: 1,
    author: "john",
    year: 2024,
    month: 6,
    day: 27,
    description: "YouTube Music subscription",
    category: "internet",
    totalCost: 11.99,
    quotas: { john: 3.99, mary: 4, james: 4.0 },
  };
  const maryDrink = {
    transactionId: 2,
    author: "mary",
    year: 2024,
    month: 7,
    day: 4,
    description: "Drink with friends",
    category: "relax",
    totalCost: 9.0,
  };
  const johnGasoline = {
    transactionId: 3,
    author: "john",
    year: 2024,
    month: 7,
    day: 2,
    description: "Gasoline",
    category: "car",
    totalCost: 60.0,
  };
  await transactions.insertOne(johnShopping);
  await transactions.insertOne(maryJamesBirthdayPresent);
  await transactions.insertOne(netflix);
  await transactions.insertOne(ytmusic);
  await transactions.insertOne(maryDrink);
  await transactions.insertOne(johnGasoline);

  const jamesRefundMary = {
    transactionId: 4,
    author: "mary",
    year: 2024,
    month: 7,
    day: 2,
    description: "Refund for past bill",
    category: "bills",
    totalCost: 0.0,
    quotas: { mary: -41.5, james: 41.5 },
  };
  const johnRefundMary = {
    transactionId: 4,
    author: "mary",
    year: 2024,
    month: 7,
    day: 2,
    description: "Refund for past bill",
    category: "bills",
    totalCost: 0.0,
    quotas: { mary: -33.1, john: 33.1 },
  };
  await transactions.insertOne(jamesRefundMary);
  await transactions.insertOne(johnRefundMary);
};

module.exports = resetDb;
