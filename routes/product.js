const express = require("express");
const routeProduct = express.Router();
const { Product, validationProduct } = require("./../models/product");
const roles = require("./../middleware/role");
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

routeProduct.get("/", roles(["OWNER", "USER", "ADMIN"]), async (req, res) => {
  let { take = 10, page = 1 } = req.query;
  let skip = (page - 1) * take;
  try {
    let data = await Product.find().skip(skip).limit(take);
    res.json(data);
  } catch (e) {
    res.json({ message: e });
  }
});

routeProduct.post("/", roles(["OWNER"]), upload.single("pics"), async (req, res) => {
  let { value, error } = validationProduct.validate(req.body);
  try {
    if (error) {
      return res.status(401).json({ message: error.details[0].message });
    }
    let newPrd = new Product(value);
    await newPrd.save();
    res.status(201).json(newPrd);
  } catch (e) {
    res.status(404).json({ message: e });
  }
});

routeProduct.patch("/:id", roles(["OWNER", "ADMIN"]), async (req, res) => {
  let id = req.params.id;
  let changes = req.body;
  try {
    let changed = await Product.findByIdAndUpdate(id, changes, { new: true });
    res.status(201).json(changed);
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

routeProduct.delete("/:id", roles(["OWNER"]), async (req, res) => {
  let { id } = req.params;
  try {
    let deleted = await Product.findByIdAndDelete(id);
    res.status(201).json(deleted);
  } catch (e) {
    res.status(404).json({ message: e });
  }
});

module.exports = routeProduct;
