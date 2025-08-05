// const { secretKey } = require("./../routes/user");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")?.[1];  
  if (!token) {
    return res.status(401).json({ message: "token not exists" });
  }
  try {
    const data = jwt.verify(token, "donkey");
    next();
  } catch (e) {
    res.status(401).json({ message: e });
  }
}

module.exports = auth;