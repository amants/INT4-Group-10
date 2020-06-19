const User = require("../models/userModel");
const { msg, code } = require("../constants");
const accessTokenService = require("../services/accessTokenService");
const { cookieConfig, cookieConfigReset } = require("../config/cookies");
const check = require("../helpers/checksHelper");

exports.create = async function (req, res) {
  if (req.verified)
    return res.status(code.alreadySignedIn).send(msg.alreadySignedIn);

  const sessionCookie = req.cookies.access_token;
  if (sessionCookie) {
    // If the user is not verified but has a token, reset it
    res.cookie("access_token", "", cookieConfigReset);
  }

  const user = req.body;
  if (check.isMissingData([user.username, user.email, user.password]))
    return res.status(code.missingData).send(msg.missingData);

  if (user.password.length < 8)
    return res.status(code.invalidPassword).send(msg.invalidPassword);

  // Makes sure the e-mail is always lower case
  user.email = user.email.toLowerCase();

  const created = await User.registerNewUser(user, (res) => res);
  if (created.errors != null)
    return res.status(created.status).send({ errors: created.errors });
  const access = await accessTokenService.generateAccessTokenByRefreshToken(
    created.created.token
  );
  if (access.error != null)
    return res.status(code.badRequest).send({ error: access.error });

  res.cookie("access_token", access, cookieConfig);
  res.cookie("token", created.created.token, cookieConfig);
  return res.status(code.success).send(msg.success);
};

exports.uploadCocktail = async function (link, cocktailId, userId, lobbyId) {
  if (lobbyId) {
    await User.uploadCocktailLobby(link, lobbyId, userId, cocktailId);
  }
  const cocktailUser = await User.uploadCocktailUser(link, userId, cocktailId);
  if (cocktailUser) {
    return cocktailUser;
  } else {
    return null;
  }
};

exports.getMe = async function (req, res) {
  const { username } = req.verified;
  const user = await User.getUserSimple(username);
  if (user === null)
    return res.status(code.notAuthenticated).json(msg.notAuthenticated);
  // else
  //   return res.status(code.badRequest).send({ error: user.error });

  const payload = {
    id: user.user_id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    joined: user.joined,
  };
  return res.status(code.success).json(payload);
};
