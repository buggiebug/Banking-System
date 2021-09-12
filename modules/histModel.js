const mongoose = require("mongoose");

const histdbSchema = mongoose.Schema({
  remail: String,
  semail: String,
  amount: Number,
  date: Date,
});

var histdbModel = mongoose.model("transitionHistory", histdbSchema);

module.exports = histdbModel;
