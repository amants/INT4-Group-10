const User = require("../controllers/userController");
const Lobby = require("../controllers/lobbyController");
const Session = require("../controllers/sessionController");

module.exports = function (app) {
  app.route("/auth").post(Session.authenticate);

  app.route("/me").get(User.getMe);

  app.route("/users/:q").get(Lobby.findUsers);

  app.route("/party/:id/members").get(Lobby.getPartyMembers);

  // app.route("/cocktails").get(Lobby.getRandomCocktail);
  // app.route("/cocktailnew").get(Lobby.getNewCocktailForLobbyRest);

  app.route("/cocktails/:order").get(User.getUserCocktails);

  app.route("/cocktail/:id").get(User.getCocktailById);

  // app.route("/party/:id/members/:memberId/add").get(Lobby.addPartyMember);

  app.route("/party").post(Lobby.create);

  app.route("/party/:id").get(Lobby.findPartyById); //.delete(Lobby.leaveParty);

  app.route("/parties").get(Lobby.getAllParties);

  app.route("/logout").get(Session.logout);

  app.route("/register").post(User.create);
};
