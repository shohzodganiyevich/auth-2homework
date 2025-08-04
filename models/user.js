const mongoose = require("mongoose");
const joi = require("joi");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  rol: String,
});

const User = mongoose.model("user", UserSchema);

const validationUser = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  rol: joi.string().required(),
});

module.exports = { User, validationUser };
