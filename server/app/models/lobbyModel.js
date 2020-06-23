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

  static getRecipeStepsByCocktailId(cocktailId) {
    return DbHelper.getRecipeStepsByCocktailId(cocktailId);
  }

  static getCocktailIngredients(cocktailId) {
    return DbHelper.getCocktailIngredients(cocktailId);
  }

  static addCocktailAsUnlockedLobby(cocktailId, lobby_id, user_id) {
    return DbHelper.addCocktailAsUnlockedLobby(cocktailId, lobby_id, user_id);
  }

  static addCocktailAsUnlockedUser(cocktailId, user_id) {
    return DbHelper.addCocktailAsUnlockedUser(cocktailId, user_id);
  }

  static updateUserScores(list) {
    return DbHelper.updateUserScores(list);
  }

  static getQuestionsByCocktailId(cocktailId) {
    return DbHelper.getQuestionsByCocktailId(cocktailId);
  }

  static getLobbyCompletedCocktails(cocktailId) {
    return DbHelper.getLobbyCompletedCocktails(cocktailId);
  }

  static getAnswersOfQuestion(questionId) {
    return DbHelper.getAnswersOfQuestion(questionId);
  }

  static getNQuestions(cocktailId, questionLength) {
    return DbHelper.getNQuestions(cocktailId, questionLength);
  }

  static getLastQuestion(cocktailId) {
    return DbHelper.getLastQuestion(cocktailId);
  }

  static getCorrectAnswer(questionId) {
    return DbHelper.getCorrectAnswer(questionId);
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
