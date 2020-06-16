const DbTableName = "chat";
const DbHelper = require("../database/dbHelper");

// User object constructor
class Chat {
  constructor(chat) {
    this.id = chat.id;
  }

  static getChatMessages(id) {
    return DbHelper.getChatMessages(DbTableName, id);
  }

  static sendMessage(payload, userId) {
    return DbHelper.sendMessage({
      ...payload,
      userId,
    });
  }
}

module.exports = Chat;
