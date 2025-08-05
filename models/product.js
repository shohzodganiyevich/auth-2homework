const mongoose = require("mongoose");
const joi = require("joi");
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  decribtion: String,
});

const Product = mongoose.model("product", ProductSchema);

const validationProduct = joi.object({
  name: joi.string().required(),
  price: joi.number().required().min(0),
  image: joi.string().uri().required(),
  decribtion: joi.string(),
});

module.exports = { Product, validationProduct };
