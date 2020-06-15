const Lobby = require("../models/lobbyModel");
const User = require("../models/userModel");
const { msg, code } = require("../constants");
const check = require("../helpers/checksHelper");
// const accessTokenService = require("../services/accessTokenService");
// const { cookieConfig, cookieConfigReset } = require("../config/cookies");
// const check = require("../helpers/checksHelper");

exports.create = async function (req, res) {
  const { body } = req;
  if (!req.verified)
    return res.status(code.notAuthenticated).send(msg.notAuthenticated);

  if (check.isMissingData([body.partyName, body.startDate, body.friends]))
    return res.status(code.missingData).send(msg.missingData);
  if (body.friends?.length < 1)
    return res.status(code.notEnoughFriends).send(msg.notEnoughFriends);
  const now = new Date();
  const startDate = new Date(body.startDate);
  if (now < startDate) return res.status(code.notFuture).send(msg.notFuture);
};

exports.findUsers = async function (req, res) {
  const { params } = req;
  if (!req.verified)
    return res.status(code.notAuthenticated).send(msg.notAuthenticated);

  if (check.isMissingData([params.q]))
    return res.status(code.missingData).send(msg.missingData);
  if (params.q?.length < 1) return res.status(code.tooShort).send(msg.tooShort);
  const users = await User.getAllUsersByUsernameOrEmail(params.q);
  console.log(users);
  if (users) {
    res.status(200).send(users);
  } else {
    res.status(code.notFound).send(msg.notFound);
  }
};

exports.getAllParties = async function (req, res) {
  if (!req.verified)
    return res.status(code.notAuthenticated).send(msg.notAuthenticated);

  const parties = await Lobby.getPartiesFromUser(req.verified.user_id);
  console.log(parties);
  if (parties) {
    res.status(200).send(parties);
  } else {
    res.status(code.notFound).send(msg.notFound);
  }
};
