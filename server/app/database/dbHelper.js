const { v4: uuidv4 } = require("uuid");
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

exports.getPartyById = function (tableName, id) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT lobbies.lobby_id, lobbies.name, lobbies.lobby_key, lobbies.start_date, user.username AS leadusername, user.user_id AS leadid, user.avatar AS leadavatar FROM ?? INNER JOIN user ON lobbies.party_leader=user.user_id WHERE lobby_id = ?",
      [tableName, id],
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

exports.getPartiesFromUser = function (tableName, id) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT lobbies.name, lobbies.lobby_id, lobbies.lobby_key, lobby_members.user_id, lobby_members.lobby_id, user.username AS leader FROM ?? INNER JOIN lobby_members ON lobbies.lobby_id=lobby_members.lobby_id INNER JOIN user ON lobbies.party_leader=user.user_id WHERE lobby_members.user_id = ?",
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

exports.getPartyMembers = function (tableName, id) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT lobby_members.user_id, user.username FROM ?? INNER JOIN lobby_members ON lobbies.lobby_id=lobby_members.lobby_id INNER JOIN user ON lobby_members.user_id=user.user_id WHERE lobby.lobby_id = ?",
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

exports.isUserLobbyMember = function (userId, lobbyId) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT user_id FROM ?? WHERE lobby_members.lobby_id = ? AND lobby_members.user_id = ?",
      ["lobby_members", lobbyId, userId],
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

exports.getPartyMembers = function (lobbyId) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT user.user_id, user.username, user.avatar FROM lobby_members INNER JOIN user ON lobby_members.user_id=user.user_id WHERE lobby_members.lobby_id = ?",
      [lobbyId],
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

exports.createLobby = function (tableName, message, leader) {
  return new Promise((resolve) => {
    const lobby_key = uuidv4();
    return sql.query(
      "INSERT INTO lobbies (party_leader, lobby_key, name, start_date) VALUES (?)",
      [[leader, lobby_key, message.name, message.startDate]],
      function (err, res) {
        if (err) {
          resolve(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.addUsers = async function (users, lobbyId, leader) {
  const insertArray = [];
  await users.forEach((user) => {
    insertArray.push([lobbyId, user, user === leader, 0, 0]);
  });
  insertArray.push([lobbyId, leader, 1, 0, 0]);
  return new Promise((resolve) => {
    return sql.query(
      "INSERT INTO lobby_members (lobby_id, user_id, leader, shots, score) VALUES ?",
      [insertArray],
      function (err, res) {
        if (err) {
          resolve(err);
        } else {
          resolve(res);
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

exports.getAllUsersByUsernameOrEmail = function (tableName, identification) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT user_id, username, avatar FROM ?? WHERE username LIKE ? OR email LIKE ?",
      [tableName, `%${identification}%`, `%${identification}%`],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res);
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
