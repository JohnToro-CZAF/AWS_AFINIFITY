const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Database
const { logsSchema } = require("./models/Logs");
const mongoose = require("mongoose");
const uri = "mongodb+srv://JohnPhan:Hoang1234567@thoughtfull.x1ku74i.mongodb.net/?retryWrites=true&w=majority";
const databaseName = "TrainingLog";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: databaseName,
};
mongoose.connect(uri, options)
  .then(() => console.log("Connected."))
  .catch((error) => console.log(`Error
connecting to MongoDB ${error}`));
const Logs = mongoose.model("Logs", logsSchema);

// The app
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

var messageList = {}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.handshake.address}`);
  
  socket.on("join_room", async (room) => {
    await socket.join(room);
    const userId = socket.handshake.address;
    messageList[room] = []
    console.log(`User with ID: ${userId} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    messageList[data.room].push(data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnecting", async () => {
    const userId = socket.handshake.address;
    const rooms = [...socket.rooms];
    const room = rooms[1].toString();
    const existingLog = await Logs.findOne( { userId: userId } );
    if (existingLog) {
      existingLog.chatSessions.push({
        userId: 2,
        history: messageList[room],
      });
      console.log(existingLog);
      await existingLog.save();
    } else {
      const newLog = new Logs();
      newLog.userId = userId;
      newLog.chatSessions.push({
        userId: 2,
        history: messageList[room],
      });
      await newLog.save();
    }
    messageList[room] = []
  });
});

server.listen(4000, () => {
  console.log("SERVER RUNNING");
});