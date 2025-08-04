const express = require("express");
const routeUser = express.Router();
const { User, validationUser } = require("./../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "donkey";

routeUser.get("/user", async (req, res) => {
  try {
    let data = await User.find();
    res.json(data);
  } catch (e) {
    res.json({ message: e });
  }
});

routeUser.post("/register", async (req, res) => {
  let { value, error } = validationUser.validate(req.body);
  try {
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let userbir = await User.findOne({ email: value.email });
    if (userbir) {
      return res.status(401).json({ message: "this email already exists" });
    }
    let parol = bcrypt.hashSync(value.password, 10);
    let newUser = new User({
      email: value.email,
      password: parol,
      rol: value.rol,
    });
    await newUser.save();
    res
      .status(201)
      .json({ email: value.email, password: parol, rol: value.rol });
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

routeUser.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    let user=await User.findOne({email})
    
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

module.exports = { routeUser, secretKey };
