const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const redis = require("redis");
const { Server } = require("socket.io");
const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT);
app.use(cors());

const server = http.createServer(app);

var messageList = []

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", async (room) => {
    await socket.join(room);
    // socket.emit('hello', messageList)
    // console.log(messageList)
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    messageList.push(data)
    console.log(messageList)
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    messageList = []
  });
});

server.listen(4000, () => {
  console.log("SERVER RUNNING");
});
