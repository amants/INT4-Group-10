'user strict';

require('dotenv').config()
const mysql = require('mysql');

// Local MySQL configurations
// Those are default values in case you don't have a .env file
const defaultConfiguration = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: process.env.DB_PORT || "3306",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "test",
  socketPath: process.env.DB_SOCKETPATH || ""
}

module.exports = function (extra = {}) {
  const configurations = {...defaultConfiguration, ...extra}
  const connection = mysql.createConnection(configurations);

  connection.connect(function(err) {
    if (err) {
        console.error(`error: ${ err.message }`);
      }
  });

  return connection;
}
