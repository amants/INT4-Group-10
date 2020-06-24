const User = require("../models/userModel");
const { msg, code } = require("../constants");
const accessTokenService = require("../services/accessTokenService");
const { cookieConfig, cookieConfigReset } = require("../config/cookies");
const check = require("../helpers/checksHelper");

exports.create = async function (req, res) {
  if (req.verified)
    return res.status(code.alreadySignedIn).send(msg.alreadySignedIn);

  const user = req.body;
  if (
    check.isMissingData([
      user.username,
      user.email,
      user.password,
      user.country_id,
    ])
  )
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
    flag_url: user.flag_url,
    stamp_url: user.stamp_url,
    country_name: user.name,
  };

  payload.unlocked_cocktails = await User.getUnlockedCocktailsByUserId(
    user.user_id,
    "none"
  );

  return res.status(code.success).json(payload);
};

exports.getUserCocktails = async function (req, res) {
  const { params, verified } = req;
  const { order } = params;
  const { username, user_id } = verified;
  const user = await User.getUserSimple(username);
  if (user === null)
    return res.status(code.notAuthenticated).json(msg.notAuthenticated);
  // else
  const payload = {};

  const unlockedCocktails = await User.getUnlockedCocktailsByUserId(
    user_id,
    order
  );

  if (unlockedCocktails !== null) payload.items = unlockedCocktails;
  else payload.items = [];

  const lockedCocktailCount = await User.getNotUnlockedCocktailCountByUserId(
    user_id
  );

  if (lockedCocktailCount)
    payload.not_unlocked_count = lockedCocktailCount?.not_unlocked_count;
  return res.status(code.success).json(payload);
};

exports.getCountries = async function (req, res) {
  const countries = await User.getAllCountries();

  if (countries) return res.status(code.success).json({ countries });
  else return res.status(code.success).json({ countries: [] });
};

exports.getCocktailById = async function (req, res) {
  const { params, verified } = req;
  const { id } = params;
  const { username, user_id } = verified;
  const user = await User.getUserSimple(username);
  if (user === null)
    return res.status(code.notAuthenticated).json(msg.notAuthenticated);
  // else

  const isUnlocked = await User.isCocktailUnlocked(id, user_id);
  if (!isUnlocked)
    return res.status(code.noPermissions).json(msg.noPermissions);

  const lockedCocktailCount = await User.getUnlockedCocktailById(id);
  return res.status(code.success).json(lockedCocktailCount);
};

exports.validateInput = async function (req, res) {
  const { params } = req;
  const { column, q } = params;
  const user = await User.validateInput(column, q);
  if (user.length > 0)
    return res.status(code.badRequest).json({ unique: false });
  // else
  return res.status(code.success).json({ unique: true });
};
