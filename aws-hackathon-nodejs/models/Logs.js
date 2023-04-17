const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const logsSchema = new Schema({
  userId: String,
  chatSessions: [
    {
      userId: String,
      history: [
        {
          room: String,
          author: String,
          message: String,
          time: String,
          sentiment: String
        }
      ]
    }
  ]
});

module.exports = { logsSchema };