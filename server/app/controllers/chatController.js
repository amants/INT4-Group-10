const Chat = require("../models/chatModel");
const User = require("../models/userModel");
// const { msg, code } = require("../constants");

exports.getMessages = async (id) => {
  return await Chat.getChatMessages(id);
};

exports.newMessage = async (payload, lobbyId, userId) => {
  return await Chat.sendMessage(payload, lobbyId, userId);
};
