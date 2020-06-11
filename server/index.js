require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const tokenMiddleware = require("./app/middlewares/tokenMiddleware");
const chatController = require("./app/controllers/chatController");
const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

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

app.use(express.static("public"));
app.use(cookieParser());
app.use(cors(corsOptionsDelegate));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(tokenMiddleware.checkTokens);

const io = socket(server);
io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);
  socket.on("leave lobby", (data) => {
    socket.leave(data.room);
    socket.broadcast
      .to(data.room)
      .emit("system message", { message: "user left the room" });
    socket.broadcast.to(data.room).emit("playerCountUpdate", { users: [] });
  });

  socket.on("new message", async (data) => {
    const message = await chatController.newMessage(data);
    socket.broadcast.to(data.lobby_id).emit("receive message", message);
    socket.emit("receive message", message);
  });

  socket.on("disconnect", (data) => {
    socket.broadcast
      .to(data.room)
      .emit("receive message", { message: "user left the room" });
    socket.broadcast.to(data.room).emit("playerCountUpdate", { users: [] });
  });

  socket.on("join room", async (data) => {
    socket.join(data.room);
    const chats = await chatController.getMessages(data.room);
    socket.emit("initial messages", { message: "user joined", chats });
    socket.broadcast.to(data.room).emit("system message", "user joined");
    socket.broadcast.to(data.room).emit("playerCountUpdate", { users: [] });
  });

  socket.on("chat", (data) => {
    io.sockets.emit("chat", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});

const routes = require("./app/routes");
// Registers the route
routes(app);
