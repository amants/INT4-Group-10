/* eslint-disable no-console */
require('dotenv').config()
const fs = require('fs');
const connection = require("../models/db")({  multipleStatements: true  })

module.exports = function execute(schemaName, debug) {
  const schema = fs.readFileSync(`./app/database/queries/${  schemaName}`).toString();

  connection.query(schema, function load(err, results) {
    if (err) {
      console.error(err);
    }
    else if (debug) {
        results.forEach(res => {
          console.log(res);
        });
      }
      else {
        console.log(`${schemaName  } loaded successfully`)
      }
  });
}
