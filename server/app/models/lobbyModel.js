const sql = require("./db.js")();

const DbTableName = "lobbies";
const DbHelper = require("../database/dbHelper");

// User object constructor
class Lobby {
  constructor(lobby) {
    this.name = lobby.email;
    this.startDate = lobby.startDate;
    this.friends = lobby.friends;
  }

  static createParty(newUser, result) {
    sql.query("INSERT INTO user set ?", newUser, function (err, res) {
      if (err) {
        result(null, err);
      } else {
        result(null, res.insertId);
      }
    });
  }

  static getPartiesFromUser(userId) {
    return DbHelper.getPartiesFromUser(DbTableName, userId);
  }

  static getUserById(userId, result) {
    return DbHelper.getById(DbTableName, userId, result);
  }
}

module.exports = Lobby;
