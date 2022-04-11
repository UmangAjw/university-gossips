const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
  },
  orderDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderDetails",
  },
  user: Object,
  createdAt: Number,
  productName: String,
  productPrice: Number,
  productDesc: String,
  productStock: Number,
  productProfilePic: String,
});
module.exports = mongoose.model("Products", ProductSchema);
