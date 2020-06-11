const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SessionService = require("./sessionModel");
const sql = require("./db.js")();

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
const i = "HugeClone"; // Issuer
const a = "https://neolol.com"; // Audience

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

  static getUserById(userId, result) {
    return DbHelper.getById(DbTableName, userId, result);
  }

  static getUserSimple(username, result) {
    return DbHelper.getByUsername(DbTableName, username, result);
  }

  static getUserByRefreshToken(token, result) {
    return DbHelper.getById(DbTableName, token, result);
  }

  static updateUserById(id, user, result) {
    sql.query("UPDATE user SET ? WHERE id = ?", [user, id], function (
      err,
      res
    ) {
      if (err) {
        result(null, err);
      } else {
        result(null, res);
      }
    });
  }

  static getAllUsers(result) {
    return DbHelper.getAll(DbTableName, result);
  }

  static async getSessionByAuth(credentials, result) {
    sql.query(
      "SELECT salt FROM user WHERE email = ? ",
      [credentials.email],
      async function (err, res) {
        if (res.length !== 1) {
          return result(null, {
            status: 400,
            message: "INVALID_CREDENTIALS",
          });
        }
        const encryptedPass = await bcrypt.hash(
          credentials.password,
          res[0].salt
        );
        sql.query(
          "SELECT username, id, email, avatar, token FROM user " +
            "WHERE email = ? AND  password = ?",
          [credentials.email, encryptedPass],
          async function (errSub, resSub) {
            if (errSub) {
              result(errSub, {
                status: 500,
                message: errSub,
              });
            } else {
              const { username, id, email, avatar } = resSub[0];
              const sessiontokenpayload = {
                username,
                id,
                email,
                avatar,
              };
              // If the user has matched,
              if (resSub.length === 1) {
                const response = await SessionService.generateSessionToken(
                  sessiontokenpayload
                );
                result(null, {
                  status: 200,
                  access_token: response,
                  token: resSub[0].token,
                });
              } else {
                result(null, {
                  status: 400,
                  message: "INVALID_CREDENTIALS",
                });
              }
            }
          }
        );
      }
    );
  }

  static async generateAccessTokenByRefreshToken(token, accessToken, result) {
    const verifyOptions = {
      issuer: i,
      audience: a,
      algorithm: ["HS512"],
    };
    let legit = {};
    if (accessToken) {
      legit = jwt.verify(accessToken, privateKEYAccess, verifyOptions);
    } else {
      legit = jwt.verify(token, privateKEY, verifyOptions);
    }
    sql.query(
      "SELECT username, id, email, avatar FROM user " +
        "WHERE username = ? AND token = ?",
      [legit.username, token],
      async function (err, res) {
        if (err) {
          result(err, {
            status: 500,
            message: err,
          });
        }
        // If the user has matched,
        else if (res.length === 1) {
          const response = await SessionService.generateSessionToken(res[0]);
          result(null, {
            status: 200,
            access_token: response,
            token,
          });
        } else {
          result(null, {
            status: 400,
            message: "INVALID_REFRESH_TOKEN",
          });
        }
      }
    );
  }

  static async registerNewUser(credentials) {
    const usedPayload = JSON.parse(JSON.stringify(credentials));
    const refreshPayload = {
      username: usedPayload.username,
      email: usedPayload.email,
      nickname: usedPayload.nickname,
      etc: usedPayload["g-recaptcha-response"],
    };
    return new Promise((resolve) => {
      const errors = {};
      sql.query(
        "SELECT SUM(CASE WHEN username = ? THEN 1 ELSE 0 END) AS username, " +
          "SUM(CASE WHEN nickname = ? THEN 1 ELSE 0 END) AS nickname, " +
          "SUM(CASE WHEN email = ? THEN 1 ELSE 0 END) AS email FROM user",
        [usedPayload.username, usedPayload.nickname, usedPayload.email],
        async function (err, res) {
          Object.keys(res[0]).map((key) => {
            if (res[0][key] >= 1) {
              errors[key] = "NOT_UNIQUE";
            }
          });

          if (
            usedPayload.password.length < 6 ||
            usedPayload.password.length > 30
          ) {
            errors.password = "PASSWORD_INVALID";
          }

          if (Object.values(errors).length > 0) {
            return resolve({ status: 403, errors });
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
            "INSERT INTO user (username, nickname, email, password, about, avatar, token, salt) " +
              "VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);",
            [
              usedPayload.username,
              usedPayload.nickname,
              usedPayload.email,
              encryptedPass,
              usedPayload.about,
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
              User.generateAccessTokenByRefreshToken(
                token,
                undefined,
                function (errGenerate, resGenerate) {
                  if (errGenerate) {
                    return resolve(errGenerate);
                  }
                  return resolve(resGenerate);
                }
              );
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
