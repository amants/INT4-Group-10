const { v4: uuidv4 } = require("uuid");
const { response } = require("express");
const sql = require("../models/db.js")();

exports.executeQuery = function (query, parameters, result) {
  sql.query(query, parameters, function (err, res) {
    if (err) {
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

exports.getRandomCocktail = function () {
  return new Promise((resolve) => {
    sql.query(
      "SELECT cocktail_id FROM ?? ORDER BY RAND() LIMIT 1",
      ["cocktails"],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getUnlockedCocktailById = function (cocktailId) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT cocktails.cocktail_id, cocktails.name, countries.country_key, cocktails.difficulty, cocktails.price, cocktails.duration, countries.flag_url, cocktails.image, cock.time_unlocked, user_cocktail_photos.photo_url, countries.name AS country_name FROM user_unlocked_cocktails AS cock INNER JOIN cocktails ON cock.cocktail_id = cocktails.cocktail_id INNER JOIN countries ON countries.country_id = cocktails.country_id LEFT OUTER JOIN user_cocktail_photos ON user_cocktail_photos.cocktail_id = cock.cocktail_id WHERE cocktails.cocktail_id = ?",
      [cocktailId],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getUnlockedCocktailsByUserId = function (userId, order) {
  return new Promise((resolve) => {
    const query = `SELECT cocktails.cocktail_id, cocktails.name, countries.country_key, cocktails.difficulty, cocktails.price, cocktails.duration, countries.flag_url, cocktails.image, cock.time_unlocked, user_cocktail_photos.photo_url, countries.name AS country_name FROM user_unlocked_cocktails AS cock INNER JOIN cocktails ON cock.cocktail_id = cocktails.cocktail_id INNER JOIN countries ON countries.country_id = cocktails.country_id LEFT OUTER JOIN user_cocktail_photos ON user_cocktail_photos.cocktail_id = cock.cocktail_id WHERE cock.user_id = ? ORDER BY ${
      order !== "none" ? `cocktails.${order}` : `cock.time_unlocked`
    } ASC`;
    sql.query(query, [userId], function (err, res) {
      if (err) {
        console.log(err);
        resolve(null);
      } else {
        resolve(res);
      }
    });
  });
};

exports.isCocktailUnlocked = function (cocktailId, userId) {
  return new Promise((resolve) => {
    sql.query(
      `SELECT * FROM user_unlocked_cocktails WHERE cocktail_id = ? AND user_id = ?`,
      [cocktailId, userId],
      function (err, res) {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.getNotUnlockedCocktailCountByUserId = function (userId) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT Count(M.cocktail_id) AS not_unlocked_count FROM cocktails AS M WHERE M.cocktail_id NOT IN (SELECT F.cocktail_id FROM user_unlocked_cocktails AS F WHERE user_id = ?)",
      [userId],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getById = function (tableName, id) {
  return new Promise((resolve) => {
    sql.query("SELECT * FROM ?? WHERE user_id = ?", [tableName, id], function (
      err,
      res
    ) {
      if (err) {
        resolve(null);
      } else {
        resolve(res?.[0]);
      }
    });
  });
};

exports.updateUserScores = function (list) {
  return new Promise((resolve) => {
    const errors = [];
    const results = [];
    list.forEach(async (item, i) => {
      await sql.query(
        "UPDATE lobby_members SET score = ?, shots = ? WHERE lobby_id = ? AND user_id = ?",
        item,
        function (err, res) {
          if (err) {
            console.error(err);
            errors.push(err);
          } else {
            // console.error(err);
            results.push(res);
          }
        }
      );
      if (list.length === i + 1) {
        resolve([...errors, ...results]);
      }
    });
  });
};

exports.getRecipeStepsByCocktailId = function (cocktailId) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT * FROM cocktail_steps WHERE cocktail_id = ?",
      [cocktailId],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.getCocktailIngredients = function (cocktailId) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT * FROM cocktail_ingredients WHERE cocktail_id = ?",
      [cocktailId],
      function (err, res) {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.getCorrectAnswer = function (questionId) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT answer_id FROM answers WHERE question_id = ? AND correct = 1",
      [questionId],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getQuestionsByCocktailId = function (id) {
  return new Promise((resolve) => {
    sql.query("SELECT * FROM questions WHERE cocktail_id = ?", [id], function (
      err,
      res
    ) {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  });
};

exports.getNQuestions = function (cocktailId, questionLength) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT * FROM questions WHERE cocktail_id = ? ORDER BY RAND() LIMIT ?",
      [cocktailId, questionLength],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.getLobbyCompletedCocktails = function (id) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT * FROM lobby_unlocked_cocktails WHERE lobby_id = ?",
      [id],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.getAnswersOfQuestion = function (id) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT answer_id, answer, question_id, correct FROM answers WHERE question_id = ? ORDER BY RAND()",
      [id],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.getPartyById = function (tableName, id) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT lobbies.lobby_id, lobbies.name, lobbies.lobby_key, lobbies.start_date, user.username AS leadusername, user.user_id AS leadid, user.avatar AS leadavatar FROM ?? INNER JOIN user ON lobbies.party_leader=user.user_id WHERE lobby_id = ?",
      [tableName, id],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getAllPartyDataById = function (lobbyId) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT lobbies.lobby_id, lobbies.current_cocktail, cocktails.name, cocktails.country_id, cocktails.image, lobbies.name, lobbies.lobby_key, lobbies.start_date, user.username AS leadusername, user.user_id AS leadid, user.avatar AS leadavatar FROM ?? INNER JOIN user ON lobbies.party_leader=user.user_id INNER JOIN cocktails ON lobbies.current_cocktail=cocktails.cocktail_id WHERE lobby_id = ?",
      ["lobbies", lobbyId],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getByUsername = function (tableName, username) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT * FROM ?? WHERE username = ?",
      [tableName, username],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getChatMessages = function (tableName, id) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT chat.message, chat.time_posted, user.username, chat.lobby_id, user.avatar FROM ?? INNER JOIN user ON chat.user_id=user.user_id WHERE lobby_id = ?",
      [tableName, id],
      function (err, res) {
        if (err) {
          resolve([]);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.getPartiesFromUser = function (tableName, id) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT lobbies.name, lobbies.lobby_id, lobbies.lobby_key, lobby_members.user_id, lobby_members.lobby_id, user.username AS leader FROM ?? INNER JOIN lobby_members ON lobbies.lobby_id=lobby_members.lobby_id INNER JOIN user ON lobbies.party_leader=user.user_id WHERE lobby_members.user_id = ?",
      [tableName, id],
      function (err, res) {
        if (err) {
          resolve([]);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.isUserLobbyMember = function (userId, lobbyId) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT user_id FROM ?? WHERE lobby_members.lobby_id = ? AND lobby_members.user_id = ?",
      ["lobby_members", lobbyId, userId],
      function (err, res) {
        if (err) {
          resolve([]);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.getPartyMembers = function (lobbyId) {
  return new Promise((resolve) => {
    return sql.query(
      "SELECT user.user_id, user.username, user.avatar, lobby_members.score, lobby_members.shots FROM lobby_members INNER JOIN user ON lobby_members.user_id=user.user_id WHERE lobby_members.lobby_id = ?",
      [lobbyId],
      function (err, res) {
        if (err) {
          resolve([]);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.sendMessage = function (message) {
  return new Promise((resolve) => {
    return sql.query(
      "INSERT INTO chat (lobby_id, user_id, message) VALUES (?)",
      [[message.lobbyId, message.userId, message.message]],
      function (err, res) {
        if (err) {
          resolve(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.uploadCocktailLobby = function (link, lobbyId, userId, cocktailId) {
  return new Promise((resolve) => {
    return sql.query(
      "INSERT INTO lobby_cocktail_photos (photo_url, lobby_id, cocktail_id, user_id) VALUES (?)",
      [[link, lobbyId, cocktailId, userId]],
      function (err, res) {
        if (err) {
          resolve(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.uploadCocktailUser = function (link, userId, cocktailId) {
  return new Promise((resolve) => {
    return sql.query(
      "INSERT INTO lobby_cocktail_photos (photo_url, cocktail_id, user_id) VALUES (?)",
      [[link, cocktailId, userId]],
      function (err, res) {
        if (err) {
          resolve(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.createLobby = function (party, leader, cocktail) {
  return new Promise((resolve) => {
    const lobby_key = uuidv4();
    return sql.query(
      "INSERT INTO lobbies (party_leader, lobby_key, name, start_date, current_cocktail) VALUES (?)",
      [[leader, lobby_key, party.name, party.startDate, cocktail]],
      function (err, res) {
        if (err) {
          resolve(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.addUsers = async function (users, lobbyId, leader) {
  const insertArray = [];
  await users.forEach((user) => {
    insertArray.push([lobbyId, user, user === leader, 0, 0]);
  });
  insertArray.push([lobbyId, leader, 1, 0, 0]);
  return new Promise((resolve) => {
    return sql.query(
      "INSERT INTO lobby_members (lobby_id, user_id, leader, shots, score) VALUES ?",
      [insertArray],
      function (err, res) {
        if (err) {
          resolve(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.getByIdentification = function (tableName, identification) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT * FROM ?? WHERE username = ? OR email = ?",
      [tableName, identification, identification],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getAllUsersByUsernameOrEmail = function (tableName, identification) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT user_id, username, avatar FROM ?? WHERE username LIKE ? OR email LIKE ?",
      [tableName, `%${identification}%`, `%${identification}%`],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.validateSessionToken = function (tableName, payload) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT * FROM ?? WHERE username = ? AND email = ? AND user_id = ?",
      [tableName, payload.username, payload.email, payload.user_id],
      function (err, res) {
        if (err) {
          resolve(null);
        } else {
          resolve(res?.[0]);
        }
      }
    );
  });
};

exports.getByRefreshToken = function (tableName, token, result) {
  return new Promise((resolve) => {
    sql.query(
      "SELECT * FROM ?? WHERE refresh_token = ?",
      [tableName, token],
      function (err, res) {
        if (err) {
          return resolve([err, null]);
        } else {
          return resolve([null, res?.[0]]);
        }
      }
    );
  });
};

exports.getAll = function (tableName, result) {
  sql.query("SELECT * FROM ??", [tableName], function (err, res) {
    if (err) {
      result(null, err);
    } else {
      result(null, res);
    }
  });
};
