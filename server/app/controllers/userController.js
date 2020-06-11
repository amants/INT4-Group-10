const User = require("../models/userModel");
const { msg, code } = require("../constants");
// const accessTokenService = require("../services/accessTokenService");

exports.logout = function (req, res) {
  res.cookie("access_token", "", { maxAge: 0 });
  res.cookie("refresh_token", "", { maxAge: 0 });
  res.status(200).send({
    message: "SIGNED_OUT",
  });
};

exports.getMe = async function (req, res) {
  const { username } = req.verified;
  const user = await User.getUserSimple(username, (resp) => {
    console.log(resp);
    return resp;
  });
  if (user == null)
    return res.status(code.notAuthenticated).json(msg.notAuthenticated);
  if (user.error != null)
    return res.status(code.badRequest).send({ error: user.error });

  return res.status(code.success).json(user);
};

exports.register_user = async function (req, res) {
  const sessionCookie = req.cookies.access_token;
  if (sessionCookie) {
    res.cookie("access_token", "", { maxAge: 0 });
    return res.status(400).send({
      message: "ALREADY_SIGNED_IN",
    });
  }
  const user = req.body;
  if (
    !user.email ||
    !user.password ||
    !user.nickname ||
    !user.username ||
    !user["g-recaptcha-response"]
  ) {
    return res.status(400).send({
      message: "MISSING_DATA",
    });
  }
  // This can also take the user's IP as remoteIp
  const resp = await User.registerNewUser(user);
  if (resp.errors) {
    return res.status(403).send({
      message: resp.errors,
    });
  }

  res.cookie("access_token", resp.access_token, {
    maxAge: 2678400,
    httpOnly: true,
  });
  return res.status(resp.status).send({
    message: "SUCCESSFULLY_REGISTERED",
    access_token: resp.access_token,
    token: resp.token,
  });
};
