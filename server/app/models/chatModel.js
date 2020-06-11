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

  static sendMessage(payload, user) {
    return DbHelper.sendMessage(DbTableName, {
      ...payload,
      ...user,
    });
  }
}

module.exports = Chat;
