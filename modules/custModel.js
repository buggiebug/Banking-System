const mongoose = require("mongoose");

const custSchema = mongoose.Schema({
  name: String,
  phoneNo: Number,
  email: String,
  currentBalance: Number,
  debitBalance: Number,
  creditBalance: Number,
});

var custModel = mongoose.model("custmers", custSchema);

module.exports = custModel;
