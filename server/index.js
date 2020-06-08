const express = require("express");
const socket = require("socket.io");

const app = express();
const server = app.listen(4000, () => {
  console.log("Server running on port 4000");
});

app.use(express.static("public"));

const io = socket(server);
io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);

  socket.on("leave room", (data) => {
    console.log("leaving room");
    console.log(data);
    socket.leave(data.room);
  });

  socket.on("new message", (data) => {
    console.log(data);
    socket.broadcast.to(data.room).emit("receive message", data);
  });

  socket.on("disconnect", (reason) => {
    console.log("user disconnected");
  });

  socket.on("room", (data) => {
    console.log("room join");
    console.log(data);
    socket.join(data.room);
    socket.broadcast
      .to(data.room)
      .emit("receive message", { message: "user joined" });
  });

  socket.on("chat", (data) => {
    io.sockets.emit("chat", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});
