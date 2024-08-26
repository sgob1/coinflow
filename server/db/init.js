const users = require("./users.js");
const transactions = require("./transactions.js");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const resetDb = async function () {
  users.removeAll();
  transactions.removeAll();
  const johnHash = bcrypt.hashSync("notapass", SALT_ROUNDS);
  const maryHash = bcrypt.hashSync("flowerrose", SALT_ROUNDS);
  const jamesHash = bcrypt.hashSync("123456", SALT_ROUNDS);

  const john = {
    id: 0,
    username: "john",
    passwordHash: johnHash,
    name: "John",
    surname: "Malkovich",
  };
  const mary = {
    id: 1,
    username: "mary",
    passwordHash: maryHash,
    name: "Mary",
    surname: "Ann Foster",
  };
  const james = {
    id: 2,
    username: "james",
    passwordHash: jamesHash,
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
    quotas: { john: 120.0 },
  };
  const maryJamesBirthdayPresent = {
    transactionId: 1,
    author: "mary",
    year: 2024,
    month: 7,
    day: 3,
    description: "Birthday present for John",
    category: "shopping",
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
    quotas: { mary: 9.0 },
  };
  const johnGasoline = {
    transactionId: 3,
    author: "john",
    year: 2024,
    month: 7,
    day: 2,
    description: "Gasoline",
    category: "car",
    quotas: { john: 60.0 },
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
    quotas: { mary: -41.5, james: 41.5 },
  };
  const johnRefundMary = {
    transactionId: 5,
    author: "mary",
    year: 2024,
    month: 7,
    day: 3,
    description: "Refund for past bill",
    category: "bills",
    quotas: { mary: -33.1, john: 33.1 },
  };
  await transactions.insertOne(jamesRefundMary);
  await transactions.insertOne(johnRefundMary);
};

module.exports = resetDb;
