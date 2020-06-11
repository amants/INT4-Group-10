const { code } = require("../constants/messageConstants");
// eslint-disable-next-line max-classes-per-file

class UserValidationError extends Error {
  constructor(message, status = code.badRequest) {
    super();
    this.message = message;
    this.status = status;
  }
}
module.exports.UserValidationError = UserValidationError;
