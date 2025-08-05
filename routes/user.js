const express = require("express");
const routeUser = express.Router();
const { User, validationUser } = require("./../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "donkey";
const auth = require("./../middleware/auth");
const { totp } = require("otplib");
totp.options = { step: 60, digits: 8 };
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nom = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, nom);
  },
});

const upload = multer({ storage: store });

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shohzodganiyevich@gmail.com",
    pass: "nvna aeyx umku fylx",
  },
});

routeUser.get("/user", auth, async (req, res) => {
  try {
    let data = await User.find();
    res.json(data);
  } catch (e) {
    res.status(401).json({ message: e });
  }
});

routeUser.post("/send-otp", async (req, res) => {
  let { email } = req.body;
  try {
    const otp = totp.generate(email + secretKey);
    emailTransporter.sendMail({
      to: email,
      subject: "Verifacation",
      text: `your otp code is ${otp}`,
    });
    res.json({ message: `Otp sent to ${email}` });
  } catch (e) {
    res.status(404).json({ message: e });
  }
});

routeUser.post("/verify-otp", async (req, res) => {
  let { email, otp } = req.body;
  try {
    const verify = totp.check(otp, email + secretKey);
    res.json({ verify });
  } catch (e) {
    res.status(404).json({ message: e });
  }
});

routeUser.post("/register", upload.single("images"), async (req, res) => {
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
      role: value.role,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

routeUser.post("/login", async (req, res) => {
  let { email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not exists" });
    }
    const compare = bcrypt.compareSync(password, user.password);
    if (!compare) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      secretKey
    );
    res.json({ token });
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

module.exports = { routeUser, secretKey };
