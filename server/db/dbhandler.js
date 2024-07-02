const { MongoClient } = require("mongodb");
const DEFAULT_DB_NAME = "coinflow";
const DEFAULT_MONGODB_URI = `mongodb://127.0.0.1:27017/${DEFAULT_DB_NAME}`;

let cachedDatabase = false;

async function openConnection(uri, dbname) {
    if (cachedDatabase) {
        console.log("Using existing cached connection");
        return cachedDatabase;
    } else {
        console.log(`Connecting to database ${dbname} on URI '${uri}'...`);
        try {
            const client = await MongoClient.connect(uri);
            const db = await client.db(dbname);
            cachedDatabase = db;
            return db;
        } catch (error) {
            console.log("Error establishing database connection!");
            console.log(error);
            throw error;
        }
    }
}

async function closeConnection(client) {
    try {
        await client.close();
        console.log("Closed connection with client");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    DEFAULT_DB_NAME,
    DEFAULT_MONGODB_URI,
    openConnection,
    closeConnection,
};
