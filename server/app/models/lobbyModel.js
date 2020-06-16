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

  static createParty(party, leader, cocktail) {
    return DbHelper.createLobby(party, leader, cocktail);
  }

  static leaveParty(userId, partyId) {
    return DbHelper.leaveParty(userId, partyId);
  }

  static getRandomCocktail() {
    return DbHelper.getRandomCocktail();
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

  static getAllPartyDataById(lobbyId) {
    return DbHelper.getAllPartyDataById(lobbyId);
  }

  static getPartyById(userId) {
    return DbHelper.getPartyById(DbTableName, userId);
  }

  static isRequesterLobbyMember(userId, lobbyId) {
    return DbHelper.isUserLobbyMember(userId, lobbyId);
  }
}

module.exports = Lobby;
