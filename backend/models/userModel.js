const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },

  addedAccounts: [
    {
      accountOf: {
        type: String,
        enum: ["fedex", "ups", "dhl"],
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      verified: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const user = mongoose.model("user", userSchema);
module.exports = user;
