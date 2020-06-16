const User = require("../controllers/userController");
const Lobby = require("../controllers/lobbyController");
const Session = require("../controllers/sessionController");

module.exports = function (app) {
  app.route("/auth").post(Session.authenticate);

  app.route("/me").get(User.getMe);

  app.route("/users/:q").get(Lobby.findUsers);

  app.route("/party/:id/members").get(Lobby.getPartyMembers);

  app.route("/party").post(Lobby.create);

  app.route("/party/:id").get(Lobby.findPartyById); //.delete(Lobby.leaveParty);

  app.route("/parties").get(Lobby.getAllParties);

  app.route("/logout").get(Session.logout);

  app.route("/register").post(User.create);
};
