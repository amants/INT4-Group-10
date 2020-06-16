const Lobby = require("../models/lobbyModel");
const User = require("../models/userModel");
const { msg, code } = require("../constants");
const check = require("../helpers/checksHelper");
// const check = require("../helpers/checksHelper");

exports.create = async function (req, res) {
  const { body } = req;
  if (!req.verified)
    return res.status(code.notAuthenticated).send(msg.notAuthenticated);

  if (check.isMissingData([body.name, body.startDate, body.friends]))
    return res.status(code.missingData).send(msg.missingData);
  if (body.friends?.length < 1)
    return res.status(code.notEnoughFriends).send(msg.notEnoughFriends);
  const now = new Date();
  const startDate = new Date(body.startDate);
  if (now > startDate) return res.status(code.notFuture).send(msg.notFuture);
  const cocktail = await Lobby.getRandomCocktail();
  if (!cocktail)
    return res.status(code.internalServerError).send(msg.internalServerError);
  const party = await Lobby.createParty(
    body,
    req.verified.user_id,
    cocktail.cocktail_id
  );
  if (party) {
    const users = await Lobby.addUsers(
      body.friends,
      party.insertId,
      req.verified.user_id
    );
    if (!users)
      return res.status(code.internalServerError).send(msg.internalServerError);
    else
      return res
        .status(code.success)
        .send({ ...msg.success, party_key: party.insertId });
  } else {
    return res.status(code.internalServerError).send(msg.internalServerError);
  }
};

exports.findUsers = async function (req, res) {
  const { params } = req;
  if (!req.verified)
    return res.status(code.notAuthenticated).send(msg.notAuthenticated);

  if (check.isMissingData([params.q]))
    return res.status(code.missingData).send(msg.missingData);
  if (params.q?.length < 1) return res.status(code.tooShort).send(msg.tooShort);
  const users = await User.getAllUsersByUsernameOrEmail(params.q);
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
  if (parties) {
    res.status(200).send(parties);
  } else {
    res.status(code.notFound).send(msg.notFound);
  }
};

exports.findPartyById = async function (req, res) {
  if (!req.verified)
    return res.status(code.notAuthenticated).send(msg.notAuthenticated);
  const user = await Lobby.isRequesterLobbyMember(
    req.verified.user_id,
    req.params.id
  );

  if (user.length !== 1)
    return res.status(code.noPermissions).send(msg.noPermissions);

  const party = await Lobby.getPartyById(req.params.id);
  const members = await Lobby.getPartyMembers(req.params.id);
  if (party && members) {
    const payload = {
      ...party,
      members,
      leader: {
        id: party.leadid,
        username: party.leadusername,
        avatar: party.leadavatar,
      },
    };

    delete payload.leadid,
      delete payload.leadusername,
      delete payload.leadavatar;
    return res.status(200).send(payload);
  } else {
    return res.status(code.notFound).send(msg.notFound);
  }
};

exports.localFindPartyById = async function (reqUser, partyId) {
  if (!reqUser) return false;
  const user = await Lobby.isRequesterLobbyMember(reqUser, partyId);
  if (user?.length !== 1) return false;

  const party = await Lobby.getAllPartyDataById(partyId);
  const members = await Lobby.getPartyMembers(partyId);
  if (party && members) {
    const payload = {
      ...party,
      members,
      leader: {
        id: party.leadid,
        username: party.leadusername,
        avatar: party.leadavatar,
      },
    };

    delete payload.leadid,
      delete payload.leadusername,
      delete payload.leadavatar;
    return payload;
  } else {
    return false;
  }
};

exports.getPartyMembers = async function (req, res) {
  if (!req.verified)
    return res.status(code.notAuthenticated).send(msg.notAuthenticated);
  const user = await Lobby.isRequesterLobbyMember(
    req.verified.user_id,
    req.params.id
  );

  if (user?.length !== 1)
    return res.status(code.noPermissions).send(msg.noPermissions);
  const parties = await Lobby.getPartyMembers(req.params.id);
  if (parties) {
    res.status(200).send(parties);
  } else {
    res.status(code.notFound).send(msg.notFound);
  }
};
