const express = require("express");
const api = require("./api/api.js");
const db_handler = require("./db/dbhandler.js");
const {initializeDatabase} = require("./db/init.js");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();


const app = express();
const port = process.env.PORT || 3000;
