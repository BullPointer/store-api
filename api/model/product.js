const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  available: { type: Number, default: 1 },
  rating: { type: Number, required: true },
  productImage: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
