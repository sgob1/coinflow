const { MongoClient } = require("mongodb");
const dbutils = require("./dbutils.js");
const args = require("../args.js");

let opt = args.parse();
let cachedConnection = undefined;

class DatabaseConnection {
  #client;
  #db;
  #open;

  constructor(client = undefined, db = undefined, open = false) {
    this.#client = client;
    this.#db = db;
    this.#open = open;
  }

  static async open(
    addr = opt["mongodb-addr"],
    port = opt["mongodb-port"],
    dbname = opt["dbname"]
  ) {
    if (cachedConnection && cachedConnection.isOpen()) {
      console.log("Using existing cached connection");
      return cachedConnection;
    } else {
      let uri = dbutils.uriComposer(addr, port, dbname);
      console.log(`Connecting to database '${dbname}' on URI '${uri}'...`);
      try {
        const client = await MongoClient.connect(uri);
        const db = client.db(dbname);
        cachedConnection = new DatabaseConnection(client, db, true);
        console.log(`Connected to database '${dbname}' on URI '${uri}'`);
        return cachedConnection;
      } catch (error) {
        console.log("Error establishing database connection!");
        console.log(error);
        throw error;
      }
    }
  }

  static nullConnection() {
    return new DatabaseConnection();
  }

  isOpen() {
    return this.#open;
  }

  db() {
    if (this.isOpen()) return this.#db;
  }

  close() {
    if (this.#client && this.#open) this.#client.close();
    this.#open = false;
  }
}

module.exports = DatabaseConnection;
