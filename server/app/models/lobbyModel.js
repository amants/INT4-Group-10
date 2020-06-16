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

  static createParty(party, leader) {
    return DbHelper.createLobby(DbTableName, party, leader);
  }

  static addUsers(users, lobbyId, leader) {
    return DbHelper.addUsers(users, lobbyId, leader);
  }

  static getPartiesFromUser(userId) {
    return DbHelper.getPartiesFromUser(DbTableName, userId);
  }

  static getPartyMembers(lobbyId) {
    return DbHelper.getPartyMembers(lobbyId);
  }

  static getPartyById(userId) {
    return DbHelper.getPartyById(DbTableName, userId);
  }

  static isRequesterLobbyMember(userId, lobbyId) {
    return DbHelper.isUserLobbyMember(userId, lobbyId);
  }
}

module.exports = Lobby;
