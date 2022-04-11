const mongoose = require("mongoose");

const OrderDetailSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.Mixed,
  productId: String,
  fullName: String,
  mobileNumber: Number,
  pincode: Number,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  country: String,
  createdAt: Number,
  orderStatus: String,
});

module.exports = mongoose.model("OrderDetails", OrderDetailSchema);
