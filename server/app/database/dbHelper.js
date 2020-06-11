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

exports.getChatMessages = function (tableName, id) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT chat.message, chat.time_posted, user.username, chat.lobby_id, user.avatar FROM ?? INNER JOIN user ON chat.user_id=user.user_id WHERE lobby_id = ?",
      [tableName, id],
      function (err, res) {
        if (err) {
          console.error(err);
          resolve([]);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.sendMessage = function (tableName, message) {
  return new Promise((resolve) => {
    return sql.query(
      "INSERT INTO chat (lobby_id, user_id, message) VALUES (?)",
      [[message.lobby_id, message.user_id, message.message]],
      function (err, res) {
        if (err) {
          resolve(err);
        } else {
          resolve({
            lobby_id: message.lobby_id,
            user_id: message.user_id,
            username: message.username,
            avatar: message.avatar,
            message: message.message,
            time_posted: new Date(),
          });
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
