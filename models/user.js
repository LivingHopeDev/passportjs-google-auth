const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  googleId: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
