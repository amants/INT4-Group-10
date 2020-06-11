const sql = require("../models/db.js")();

exports.executeQuery = function (query, parameters, result) {
  sql.query(query, parameters, function (err, res) {
    if (err) {
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

exports.getById = function (tableName, id, result) {
  sql.query("SELECT * FROM ?? WHERE id = ?", [tableName, id], function (
    err,
    res
  ) {
    if (err) {
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

exports.getByUsername = function (tableName, username, result) {
  sql.query(
    "SELECT * FROM ?? WHERE username = ?",
    [tableName, username],
    function (err, res) {
      if (err) {
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

exports.getByIdentification = function (tableName, identification, result) {
  sql.query(
    "SELECT * FROM ?? WHERE username = ? OR email = ?",
    [tableName, identification, identification],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

exports.getByRefreshToken = function (tableName, token, result) {
  sql.query(
    "SELECT * FROM ?? WHERE refresh_token = ?",
    [tableName, token],
    function (err, res) {
      if (err) {
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

exports.getAll = function (tableName, result) {
  sql.query("SELECT * FROM ??", [tableName], function (err, res) {
    if (err) {
      result(null, err);
    } else {
      result(null, res);
    }
  });
};
