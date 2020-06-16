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
    socket.broadcast
      .to(data.lobby_id)
      .emit("system message", { left: data.username });
    socket.broadcast.to(data.lobby_id).emit("player update", {
      members: quizInstances[data.lobby_id].members,
    });
  });

  socket.on("new message", async (data) => {
    const party = await LobbyController.localFindPartyById(
      user.user_id,
      data.lobby_id
    );
    if (!party) {
      return socket.emit("error", { error: "NO_ACCESS" });
    }
    await chatController.newMessage(data, user.user_id);
    socket.broadcast.to(data.lobby_id).emit("receive message", {
      username: user.username,
      time_posted: new Date(),
      lobby_id: data.lobby_id,
      avatar: user.avatar,
      message: data.message,
    });
    socket.emit("receive message", {
      username: user.username,
      time_posted: new Date(),
      lobby_id: data.lobby_id,
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
    if (!quizInstances[data.lobby_id]) {
      return;
    }
    const meIndex = quizInstances[data.lobby_id].members.findIndex(
      (elem) => elem.user_id === user.user_id
    );
    quizInstances[data.lobby_id].members[meIndex].ready = true;
    socket.broadcast.to(data.lobby_id).emit("player update", {
      members: quizInstances[data.lobby_id].members,
    });
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
        console.log(item.user_id, user.user_id);
        if (item.user_id === user.user_id) {
          party.members[key].online = true;
          party.members[key].ready = false;
        }
      });
      quizInstances[data.lobby_id] = {
        members: party.members,
        name: party.name,
        startDate: party.startDate,
        status: 0,
        cocktail_id: party?.current_cocktail,
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
        name: quizInstances[data.lobby_id].name,
        startDate: quizInstances[data.lobby_id].startDate,
        status: quizInstances[data.lobby_id].status,
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
