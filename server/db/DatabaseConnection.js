const { MongoClient } = require("mongodb");

class DatabaseConnection {
  #client;
  #db;
  #open;

  constructor(client = undefined, db = undefined, open = false) {
    this.#client = client;
    this.#db = db;
    this.#open = open;
  }

  static async connect(uri, dbname) {
    try {
      const client = await MongoClient.connect(uri);
      const db = client.db(dbname);
      return new DatabaseConnection(client, db, true);
    } catch (error) {
      console.log("Error establishing database connection!");
      console.log(error);
      throw error;
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
