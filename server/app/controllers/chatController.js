const Chat = require("../models/chatModel");
const User = require("../models/userModel");
// const { msg, code } = require("../constants");

exports.getMessages = async (id) => {
  return await Chat.getChatMessages(id);
};

exports.newMessage = async (payload) => {
  const [err, resp] = await User.getUserByRefreshToken(payload.token);
  if (!resp) return false;
  return await Chat.sendMessage(payload, resp);
};
