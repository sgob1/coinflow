const { MongoClient } = require("mongodb");
const dbutils = require("./dbutils.js");
const args = require("../args.js");

let opt = args.parse();
let cachedClient = undefined;
let cachedDb = undefined;

async function database() {
  let addr = opt["mongodb-addr"];
  let port = opt["mongodb-port"];
  let dbname = opt["dbname"];
  if (isOpen()) {
    console.log("Using existing cached connection");
    return cachedDb;
  } else {
    let uri = dbutils.uriComposer(addr, port, dbname);
    console.log(`Connecting to database '${dbname}' on URI '${uri}'...`);
    try {
      const client = await MongoClient.connect(uri);
      cachedClient = client;
      cachedDb = await client.db(dbname);
      console.log(`Connected to database '${dbname}' on URI '${uri}'`);
      return cachedDb;
    } catch (error) {
      console.log("Error establishing database connection!");
      console.log(error);
      throw error;
    }
  }
}

async function collection(name) {
  let db = await database();
  return await db.collection(name);
}

async function query(q, name) {
  let c = await collection(name);
  return await q(c);
}

function isOpen() {
  return cachedClient && cachedDb;
}

async function closeConnection() {
  if (isOpen()) await cachedClient.close();
  cachedClient = undefined;
  cachedDb = undefined;
}

module.exports = {
  database,
  collection,
  closeConnection,
  query,
};
