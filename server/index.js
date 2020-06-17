require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const tokenMiddleware = require("./app/middlewares/tokenMiddleware");
const chatController = require("./app/controllers/chatController");
const app = express();
const Lobby = require("./app/models/lobbyModel");
const User = require("./app/models/userModel");
const LobbyController = require("./app/controllers/lobbyController");
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function readCookie(name, cookie) {
  var nameEQ = name + "=";
  var ca = cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const whitelist = [
  "",
  "https://localhost",
  "https://localhost:3000",
  "http://localhost:3000",
  "https://int4.neolol.com",
];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = {
      origin: true,
      credentials: true,
      allowedHeaders: "User-Agent,Keep-Alive,Content-Type",
    }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false, credentials: true }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
const quizInstances = {};
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors(corsOptionsDelegate));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(tokenMiddleware.checkTokens);

const startNextQuestion = (socket, lobby_id, user) => {
  console.log("start question 2");
};

const startNextRecipe = async (socket, lobby_id, user) => {
  quizInstances[lobby_id].members.forEach((item, key) => {
    quizInstances[lobby_id].members[key].ready = false;
  });
  quizInstances[lobby_id].recipe_step = isNaN(
    quizInstances[lobby_id]?.recipe_step
  )
    ? 0
    : quizInstances[lobby_id].recipe_step + 1;
  quizInstances[lobby_id].type = "recipe";
  const recipes = await LobbyController.getRecipeStepsByCocktailId(
    quizInstances[lobby_id].cocktail_id
  );

  quizInstances[lobby_id].recipe.push(
    recipes[quizInstances[lobby_id].recipe_step]
  );

  socket.emit("player update", {
    members: quizInstances[lobby_id].members,
  });
  socket.broadcast.to(lobby_id).emit("player update", {
    members: quizInstances[lobby_id].members,
  });
  setTimeout(() => {
    socket.emit("status update", {
      type: quizInstances[lobby_id].type,
      recipe: quizInstances[lobby_id].recipe,
      recipe_step: quizInstances[lobby_id].recipe_step,
    });
    socket.broadcast.to(lobby_id).emit("status update", {
      type: quizInstances[lobby_id].type,
      recipe: quizInstances[lobby_id].recipe,
      recipe_step: quizInstances[lobby_id].recipe_step,
    });
  }, 5000);
};

const io = socket(server);
io.on("connection", async (socket) => {
  let lobby_id;
  let user;
  if (socket?.handshake?.headers?.cookie) {
    user = await User.getUserByRefreshToken(
      await readCookie("token", await socket?.handshake?.headers?.cookie)
    );
    if (!user[1]) return socket.disconnect();
  } else return socket.disconnect();

  user = user[1];

  console.log(`${user.username} joined`);

  socket.on("leave lobby", (data) => {
    Lobby.leaveParty(data.userId, data.lobby_id);

    socket.leave(data.lobby_id);
    socket.broadcast.to(data.lobby_id).emit("player update", {
      members: quizInstances[data.lobby_id].members,
    });
  });

  socket.on("new message", async (data) => {
    const party = await LobbyController.localFindPartyById(
      user.user_id,
      lobby_id
    );
    if (!party) {
      return socket.emit("errormsg", { error: "NO_ACCESS" });
    }
    await chatController.newMessage(data, lobby_id, user.user_id);
    socket.broadcast.to(lobby_id).emit("receive message", {
      username: user.username,
      time_posted: new Date(),
      lobby_id: lobby_id,
      avatar: user.avatar,
      message: data.message,
    });
    socket.emit("receive message", {
      username: user.username,
      time_posted: new Date(),
      lobby_id: lobby_id,
      avatar: user.avatar,
      message: data.message,
    });
  });

  socket.on("disconnect", () => {
    if (!quizInstances[lobby_id]) {
      return;
    }
    const meIndex = quizInstances[lobby_id].members.findIndex(
      (elem) => elem.user_id === user.user_id
    );
    quizInstances[lobby_id].members[meIndex].ready = false;
    quizInstances[lobby_id].members[meIndex].online = false;
    socket.broadcast.to(lobby_id).emit("player update", {
      members: quizInstances[lobby_id].members,
    });
  });

  socket.on("ready", (data) => {
    if (!quizInstances[lobby_id]) {
      return;
    }
    const meIndex = quizInstances[lobby_id].members.findIndex(
      (elem) => elem.user_id === user.user_id
    );
    quizInstances[lobby_id].members[meIndex].ready = data.ready;
    socket.emit("player update", {
      members: quizInstances[lobby_id].members,
    });
    socket.broadcast.to(lobby_id).emit("player update", {
      members: quizInstances[lobby_id].members,
    });

    if (quizInstances[lobby_id].type === "recipe") {
      const notReadyMembers = quizInstances[lobby_id].members.filter(
        (member) => !member.ready
      );
      if (notReadyMembers.length > 0)
        return socket.emit("ready error", {
          error: "Not all members are ready",
          members: notReadyMembers,
        });
      else startNextQuestion(socket, lobby_id, user);
    }
  });

  socket.on("answer", (data) => {
    if (!quizInstances[lobby_id]) {
      return;
    }
    if (quizInstances[lobby_id]?.time_to_answer <= 0) {
      return;
    }
    const answerCount = quizInstances[lobby_id].answered_questions[
      quizInstances[lobby_id].current_question.question_id
    ]?.voters?.filter((item) => item.user_id === user.user_id);
    if (answerCount?.length >= 1) return;
    if (
      !quizInstances[lobby_id]?.answered_questions?.[
        quizInstances[lobby_id]?.current_question.question_id
      ]
    ) {
      quizInstances[lobby_id].answered_questions[
        quizInstances[lobby_id].current_question.question_id
      ] = { voters: [] };
    }
    if (
      !quizInstances[lobby_id]?.answered_questions?.[
        quizInstances[lobby_id]?.current_question.question_id
      ]?.[data.answer_id]
    ) {
      quizInstances[lobby_id].answered_questions[
        quizInstances[lobby_id].current_question.question_id
      ][data.answer_id] = [];
    }
    quizInstances[lobby_id].answered_questions[
      quizInstances[lobby_id].current_question.question_id
    ][data.answer_id].push({
      username: user.username,
      user_id: user.user_id,
    });
    quizInstances[lobby_id].answered_questions[
      quizInstances[lobby_id].current_question.question_id
    ].voters.push({
      username: user.username,
      user_id: user.user_id,
      answer_id: data.answer_id,
    });
    quizInstances[lobby_id].time_to_answer =
      quizInstances[lobby_id]?.answered_questions?.[
        quizInstances[lobby_id]?.current_question?.question_id
      ]?.voters?.length >= quizInstances[lobby_id]?.members?.length &&
      quizInstances[lobby_id]?.members?.length
        ? 0
        : quizInstances[lobby_id].time_to_answer;
    socket.emit("status update", {
      answered_questions: quizInstances[lobby_id].answered_questions,
      time_to_answer: quizInstances[lobby_id].time_to_answer,
    });
    socket.broadcast.to(lobby_id).emit("status update", {
      answered_questions: quizInstances[lobby_id].answered_questions,
      time_to_answer: quizInstances[lobby_id].time_to_answer,
    });
  });

  socket.on("start game", async (data) => {
    if (!quizInstances[data.lobby_id]) {
      return;
    }

    const notReadyMembers = quizInstances[data.lobby_id].members.filter(
      (member) => !member.ready
    );
    if (notReadyMembers.length > 0)
      return socket.emit("ready error", {
        error: "Not all members are ready",
        members: notReadyMembers,
      });

    quizInstances[data.lobby_id].type = "quiz";
    const questions = await LobbyController.getAllQuestionsOfCocktail(
      quizInstances[data.lobby_id].cocktail_id
    );
    quizInstances[data.lobby_id].cocktail_questions[
      quizInstances[data.lobby_id].cocktail_id
    ] = questions;
    const randomQuestion = Object.values(questions)[
      Math.floor(Math.random() * Object.values(questions).length)
    ];
    quizInstances[data.lobby_id].current_question = randomQuestion;
    quizInstances[data.lobby_id].time_to_answer = 20;
    socket.emit("status update", {
      type: quizInstances[data.lobby_id].type,
      current_question: quizInstances[data.lobby_id].current_question,
      time_to_answer: quizInstances[data.lobby_id].time_to_answer,
    });
    socket.broadcast.to(data.lobby_id).emit("status update", {
      type: quizInstances[data.lobby_id].type,
      current_question: quizInstances[data.lobby_id].current_question,
      time_to_answer: quizInstances[data.lobby_id].time_to_answer,
    });
    const countdownTimer = setInterval(async () => {
      if (
        quizInstances[data.lobby_id].time_to_answer <= 0 ||
        !quizInstances[data.lobby_id].time_to_answer
      ) {
        const correctAnswer = await LobbyController.getCorrectAnswer(
          quizInstances[data.lobby_id].current_question.question_id
        );
        const updateArray = [];
        quizInstances[lobby_id]?.answered_questions?.[
          quizInstances[lobby_id]?.current_question?.question_id
        ]?.voters.forEach(async (item) => {
          const userIndex = quizInstances[lobby_id].members.findIndex(
            (elem) => elem.user_id === item.user_id
          );
          if (item.answer_id === correctAnswer) {
            quizInstances[lobby_id].members[userIndex].score += 20;
          } else {
            quizInstances[lobby_id].members[userIndex].shots += 1;
          }
          updateArray.push([
            quizInstances[lobby_id].members[userIndex].score,
            quizInstances[lobby_id].members[userIndex].shots,
            lobby_id,
            quizInstances[lobby_id].members[userIndex].user_id,
          ]);
        });
        await LobbyController.updateUserScores(updateArray);
        socket.emit("correct answer", {
          correct_answer: correctAnswer,
        });
        //TODO update points users, give shots to wrong users
        socket.broadcast.to(data.lobby_id).emit("correct answer", {
          correct_answer: correctAnswer,
        });
        socket.emit("player update", {
          members: quizInstances[lobby_id].members,
        });
        socket.broadcast.to(lobby_id).emit("player update", {
          members: quizInstances[lobby_id].members,
        });

        startNextRecipe(socket, lobby_id, user);
        return clearInterval(countdownTimer);
      }
      quizInstances[data.lobby_id].time_to_answer -= 1;
      socket.broadcast.to(data.lobby_id).emit("status update", {
        time_to_answer: quizInstances[data.lobby_id].time_to_answer,
      });
      socket.emit("status update", {
        time_to_answer: quizInstances[data.lobby_id].time_to_answer,
      });
    }, 1000);
  });

  socket.on("join room", async (data) => {
    const party = await LobbyController.localFindPartyById(
      user.user_id,
      data.lobby_id
    );
    if (!party) {
      return socket.emit("errormsg", { error: "NO_ACCESS" });
    }
    lobby_id = data.lobby_id;
    socket.join(data.lobby_id);
    if (!quizInstances[data.lobby_id]) {
      party.members.forEach((item, key) => {
        if (item.user_id === user.user_id) {
          party.members[key].online = true;
          party.members[key].ready = false;
        }
      });
      quizInstances[data.lobby_id] = {
        members: party.members,
        name: party.name,
        leader: party.leader,
        startDate: party.startDate,
        status: 0,
        answers: [],
        time_to_answer: 0,
        unlocked_cocktails: await LobbyController.getLobbyCompletedCocktails(
          data.lobby_id
        ),
        recipe_step: undefined,
        recipe: [],
        cocktail_id: party?.current_cocktail,
        current_question: null,
        cocktail_questions: {},
        answered_questions: {},
        type: "lobby",
      };
    } else {
      quizInstances[data.lobby_id].members.forEach((item, key) => {
        if (item.user_id === user.user_id) {
          quizInstances[data.lobby_id].members[key].online = true;
          quizInstances[data.lobby_id].members[key].ready = false;
        }
      });
    }
    const chats = await chatController.getMessages(data.lobby_id);
    socket.emit("initial messages", {
      chats,
      members: quizInstances[data.lobby_id].members,
      quiz: {
        leader: quizInstances[data.lobby_id].leader,
        name: quizInstances[data.lobby_id].name,
        recipe_step: quizInstances[data.lobby_id]?.recipe_step,
        answers: quizInstances[data.lobby_id].answers,
        cocktail_id: quizInstances[data.lobby_id].name,
        recipe_step: quizInstances[data.lobby_id].recipe_step,
        recipe: quizInstances[data.lobby_id].recipe,
        time_to_answer: quizInstances[data.lobby_id].time_to_answer,
        answered_questions: quizInstances[data.lobby_id].time_to_answer,
        unlocked_cocktails: quizInstances[data.lobby_id].unlocked_cocktails,
        current_question: quizInstances[data.lobby_id].current_question,
        answered_questions: quizInstances[data.lobby_id].answered_questions,
        startDate: quizInstances[data.lobby_id].startDate,
        status: quizInstances[data.lobby_id].status,
        type: quizInstances[data.lobby_id].type,
      },
    });
    console.log("broadcasting it to everywhere");
    socket.broadcast.to(data.lobby_id).emit("player update", {
      members: quizInstances[data.lobby_id].members,
    });

    console.log(`${user.username} joined the lobby`);
  });
});

const routes = require("./app/routes");
// Registers the route
routes(app);
