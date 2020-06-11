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

exports.getById = function (tableName, id) {
  return new Promise((resolve) => {
    sql.query("SELECT * FROM ?? WHERE id = ?", [tableName, id], function (
      err,
      res
    ) {
      if (err) {
        resolve(null);
      } else {
        resolve(res?.[0]);
      }
    });
  });
};

exports.getByUsername = function (tableName, username) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT * FROM ?? WHERE username = ?",
      [tableName, username],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getByIdentification = function (tableName, identification) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT * FROM ?? WHERE username = ? OR email = ?",
      [tableName, identification, identification],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.validateSessionToken = function (tableName, payload) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT * FROM ?? WHERE username = ? AND email = ? AND user_id = ?",
      [tableName, payload.username, payload.email, payload.user_id],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getByRefreshToken = function (tableName, token, result) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT * FROM ?? WHERE refresh_token = ?",
      [tableName, token],
      function (err, res) {
        if (err) {
          return resolve([err, null]);
        } else {
          return resolve([null, res?.[0]]);
        }
      }
    );
  });
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
