const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { publisher, subscriber } = require("./redis");
const cors = require("cors");

const io = new Server(server, {
  secure: true,
  reconnect: true,
  rejectUnauthorized: false,
});
app.use(cors());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
const SERVER_ID = 1;
subscriber.subscribe("chat", (msg) => {
  const { serverId, text } = JSON.parse(msg);
  if (SERVER_ID == serverId) {
    return;
  }
  io.emit("chat message", text);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    publisher.publish(
      "chat",
      JSON.stringify({ text: msg, serverId: SERVER_ID })
    );
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
