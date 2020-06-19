const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SessionService = require("./sessionModel");
const sql = require("./db.js")();
const accessTokenService = require("../services/accessTokenService");

const DbTableName = "user";
const DbHelper = require("../database/dbHelper");

const privateKEY = fs.readFileSync(
  `${__dirname}/../constants/refreshprivate.key`,
  "utf8"
);
const privateKEYAccess = fs.readFileSync(
  `${__dirname}/../constants/private.key`,
  "utf8"
);
const i = "Integration"; // Issuer
const a = "https://int4.neolol.com"; // Audience

// User object constructor
class User {
  constructor(user) {
    this.email = user.email;
    this.password = user.password;
  }

  static createUser(newUser, result) {
    sql.query("INSERT INTO user set ?", newUser, function (err, res) {
      if (err) {
        result(null, err);
      } else {
        result(null, res.insertId);
      }
    });
  }

  static getUserByUsernameOrEmail(identification, result) {
    return DbHelper.getByIdentification(DbTableName, identification, result);
  }

  static getAllUsersByUsernameOrEmail(identification, result) {
    return DbHelper.getAllUsersByUsernameOrEmail(
      DbTableName,
      identification,
      result
    );
  }

  static getUserById(userId) {
    return DbHelper.getById(DbTableName, userId);
  }

  static getUserSimple(username) {
    return DbHelper.getByUsername(DbTableName, username);
  }

  static validateSessionToken(payload) {
    return DbHelper.validateSessionToken(DbTableName, payload);
  }

  static getUserByRefreshToken(token) {
    return DbHelper.getByRefreshToken(DbTableName, token);
  }

  static async registerNewUser(credentials) {
    const usedPayload = JSON.parse(JSON.stringify(credentials));
    const refreshPayload = {
      username: usedPayload.username,
      email: usedPayload.email,
    };
    return new Promise((resolve) => {
      const errors = {};
      sql.query(
        "SELECT SUM(CASE WHEN username = ? THEN 1 ELSE 0 END) AS username, " +
          "SUM(CASE WHEN email = ? THEN 1 ELSE 0 END) AS email FROM user",
        [usedPayload.username, usedPayload.email],
        async function (err, res) {
          Object.keys(res[0]).map((key) => {
            if (res[0][key] >= 1) {
              errors[key] = "NOT_UNIQUE";
            }
          });

          if (Object.values(errors).length > 0) {
            return resolve({ status: 400, errors });
          }
          const signOptions = {
            issuer: i,
            subject: usedPayload.username,
            audience: a,
            algorithm: "HS512",
          };
          const token = jwt.sign(refreshPayload, privateKEY, signOptions);
          const salt = await bcrypt.genSalt(10);
          const encryptedPass = await bcrypt.hash(usedPayload.password, salt);
          sql.query(
            "INSERT INTO user (username, email, password, avatar, refresh_token, salt) " +
              "VALUES ( ?, ?, ?, ?, ?, ?);",
            [
              usedPayload.username,
              usedPayload.email,
              encryptedPass,
              usedPayload.avatar,
              token,
              salt,
            ],
            async function (errInsert) {
              if (errInsert) {
                return resolve({
                  status: 403,
                  errors: { global: "INSERT_FAILED" },
                });
              }
              return resolve({
                status: 200,
                created: {
                  username: usedPayload.username,
                  email: usedPayload.email,
                  password: encryptedPass,
                  avatar: usedPayload.avatar,
                  token,
                  salt,
                },
              });
            }
          );
        }
      );
    });
  }

  static async verifySession(token, result) {
    const resp = await SessionService.verifySessionToken(token);
    const { status, message, sessionExpires } = resp || {};
    result(null, {
      status,
      sessionExpires,
      message,
    });
  }

  static updateSessionById(id, user, result) {
    sql.query(
      "UPDATE user SET session = ? WHERE id = ?",
      [user.user, id],
      function (err, res) {
        if (err) {
          result(null, err);
        } else {
          result(null, res);
        }
      }
    );
  }

  static remove(id, result) {
    sql.query("DELETE FROM user WHERE id = ?", [id], function (err, res) {
      if (err) {
        result(null, err);
      } else {
        result(null, res);
      }
    });
  }
}

module.exports = User;
