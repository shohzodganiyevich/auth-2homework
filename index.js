const express = require("express");
const mongoose = require("mongoose");
const server = express();
const { routeUser } = require("./routes/user");
const routeProduct = require("./routes/product");

mongoose
  .connect("mongodb://127.0.0.1:27017/auth2homework")
  .then(() => console.log("connected to db"))
  .catch((e) => console.log(e));

server.use(express.json());
server.use("/auth", routeUser);
server.use("/product", routeProduct);

server.listen(3000, () => console.log("server started on port 3000"));
