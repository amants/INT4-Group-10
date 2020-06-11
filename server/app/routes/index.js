const User = require("../controllers/userController");
const Session = require("../controllers/sessionController");

module.exports = function (app) {
  app.route("/auth").post(Session.authenticate);

  app.route("/me").get(User.getMe);

  // app.route("/verify").get(User.verify_session);

  // app.route("/refresh").post(User.refresh_session);

  app.route("/logout").get(Session.logout);

  app.route("/register").post(User.create);
};
