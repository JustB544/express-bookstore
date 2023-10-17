/** Database config for database. */


const { Client } = require("pg");
const {DB_URI} = require("./config");
require("dotenv").config();

let db = new Client({
  connectionString: DB_URI
});

db.connect();


module.exports = db;
