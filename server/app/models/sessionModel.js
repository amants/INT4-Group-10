const jwt = require("jsonwebtoken");
const fs = require("fs");
const sql = require("./db.js")();

const privateKEY = fs.readFileSync(
  `${__dirname}/../constants/private.key`,
  "utf8"
);
const i = "Integration"; // Issuer
const a = "https://int4.neolol.com"; // Audience
const expiresIn = "24h";

class SessionService {
  constructor(session) {
    this.session = session;
  }

  static async generateSessionToken(payload) {
    const usedPayload = JSON.parse(JSON.stringify(payload));
    return new Promise((resolve) => {
      const s = usedPayload.username; // Subject
      const signOptions = {
        issuer: i,
        subject: s,
        audience: a,
        expiresIn,
        algorithm: "HS512",
      };
      const token = jwt.sign(usedPayload, privateKEY, signOptions);
      return resolve(token);
    });
  }

  static async verifySessionToken(token) {
    return new Promise((resolve) => {
      const verifyOptions = {
        issuer: i,
        audience: a,
        expiresIn,
        algorithm: ["HS512"],
      };
      try {
        const legit = jwt.verify(token, privateKEY, verifyOptions);
        const now = new Date() / 1000 || 0;
        if (legit.exp <= now) {
          return resolve({
            status: 440,
            message: "SESSION_EXPIRED",
          });
        }
        sql.query(
          "SELECT * FROM user WHERE username = ? AND  id = ?",
          [legit.username, legit.id],
          async function (err, res) {
            if (res.length === 1) {
              return resolve({
                status: 200,
                session_expires: legit.exp - now,
              });
            }
            return resolve({
              status: 402,
              message: "NOT_AUTHENTICATED",
            });
          }
        );
      } catch (err) {
        return resolve({
          status: 403,
          message: "NOT_AUTHENTICATED",
        });
      }
    });
  }

  static async isAuthenticated(token) {
    return new Promise((resolve) => {
      const verifyOptions = {
        issuer: i,
        audience: a,
        expiresIn,
        algorithm: ["HS512"],
      };
      try {
        const legit = jwt.verify(token, privateKEY, verifyOptions);
        const now = new Date() / 1000 || 0;
        if (legit.exp <= now) {
          return resolve(440);
        }
        sql.query(
          "SELECT * FROM user WHERE username = ? AND  id = ?",
          [legit.username, legit.id],
          async function (err, res) {
            if (res.length === 1) {
              return resolve(200);
            }
            return resolve(401);
          }
        );
      } catch (err) {
        return resolve(401);
      }
    });
  }
}

module.exports = SessionService;
