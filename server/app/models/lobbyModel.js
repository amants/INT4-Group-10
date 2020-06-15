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

  static getPartyMembers(lobbyId) {
    return DbHelper.getPartyMembers(lobbyId);
  }

  static getPartyById(userId, result) {
    return DbHelper.getPartyById(DbTableName, userId, result);
  }

  static isRequesterLobbyMember(userId, lobbyId) {
    return DbHelper.isUserLobbyMember(userId, lobbyId);
  }
}

module.exports = Lobby;
