import { MongoClient } from "mongodb";
import DatabaseConnection from "./DatabaseConnection.js";
const DEFAULT_DB_NAME = "coinflow";
const DEFAULT_MONGODB_URI = `mongodb://0.0.0.0:27017/${DEFAULT_DB_NAME}`;

let cachedConnection = DatabaseConnection.nullConnection();

async function openConnection(uri, dbname) {
  if (cachedConnection.isOpen()) {
    console.log("Using existing cached connection");
    return cachedConnection;
  } else {
    console.log(`Connecting to database '${dbname}' on URI '${uri}'...`);
    try {
      cachedConnection = await DatabaseConnection.connect(uri, dbname);
      return cachedConnection;
    } catch (error) {
      console.log("Error establishing database connection!");
      console.log(error);
      throw error;
    }
  }
}

function closeConnection(connection = cachedConnection) {
  try {
    connection.close();
    console.log("Closed connection with client");
  } catch (error) {
    console.log(error);
  }
}

export default {
  DEFAULT_DB_NAME,
  DEFAULT_MONGODB_URI,
  openConnection,
  closeConnection,
};
