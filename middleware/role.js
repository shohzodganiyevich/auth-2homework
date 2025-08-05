const jwt = require("jsonwebtoken");

function roles(role) {
  return function check(req, res, next) {
    const token = req.headers.authorization?.split(" ")?.[1];
    if (!token) {
      return res.status(401).json({ message: "token not exists" });
    }
    try {
      const data = jwt.verify(token, "donkey");
      if (role.includes(data.role)) {
        next();
      } else {
        res.status(401).json({ message: "User not permitted" });
      }
    } catch (e) {
      res.status(404).json({ message: e });
    }
  };
}

module.exports = roles;
