const mongoose = require("mongoose");

// Review Schema
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Changed `Type` to `type`
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0 }, // Removed `required: true` as `default` makes it unnecessary
  numReview: { type: Number, default: 0 }, // Same here
  price: { type: Number, default: 0 }, // Same here
  countInStock: { type: Number, default: 0 }, // Same here

  // Uncomment below if you want to use the reviews field
  reviews: [reviewSchema],
});

module.exports = mongoose.model("Product", productSchema);