const UserModel = require("../models/userModel");
const encryptionService = require("./encryptionService");
const { msg, code } = require("../constants");

// const model = db.user;

exports.generateAccessTokenByRefreshToken = async function (token) {
  try {
    // const user = await model.findOne({ where: { token } });
    let [err, resp] = await UserModel.getUserByRefreshToken(token);
    if (!resp)
      return {
        status: code.invalidRefreshToken,
        error: msg.invalidRefreshToken.message,
      };

    const payload = {
      username: resp.username,
      user_id: resp.user_id,
      email: resp.email,
      avatar: resp.avatar,
    };
    return await encryptionService.generateSessionToken(payload);
  } catch (err) {
    return { status: code.badRequest, error: err.message };
  }
};

exports.getUserDataByAccessToken = async function (accessToken) {
  try {
    const legit = await encryptionService.verifyToken(null, accessToken);
    const result = await UserModel.getUserById(legit.user_id);
    return result;
  } catch (err) {
    return false;
  }
};
