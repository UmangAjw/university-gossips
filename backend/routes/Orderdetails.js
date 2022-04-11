const express = require("express");
const router = express.Router();

const orderDetailsDB = require("../models/OrderDetails");
const productDB = require("../models/Product");
const userDetailsDB = require("../models/UserDetails");

router.post("/", async (req, res) => {
  const now = new Date();
  const secondsSinceEpoch = Math.round(now.getTime() / 1000);
  try {
    await orderDetailsDB
      .create({
        user: req.body.user,
        productId: req.body.productId,
        fullName: req.body.fullName,
        mobileNumber: req.body.mobileNumber,
        pincode: req.body.pincode,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        createdAt: secondsSinceEpoch,
        orderStatus: req.body.orderStatus,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Product added successfully",
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: "Bad request",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Error while creating product",
    });
  }
});

router.get("/", async (req, res) => {
  let data = await orderDetailsDB.find({});
  if (data) {
    res.json({
      msg: "All Orders info ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all orders info.",
      data: [],
      status: -1,
    });
  }
});

router.get("/getorderbyid/:userId", async (req, res) => {
  let data = [];
  let orders = await orderDetailsDB.find({ "user.uid": req.params.userId });
  for (let i = 0; i < orders.length; i++) {
    let completeOrderDetails = [];
    completeOrderDetails.push(orders[i]);
    let tempProductId = orders[i].productId;
    let tempUserId = orders[i].user.uid;
    let productDetails = await productDB.find({ _id: tempProductId });
    completeOrderDetails.push(productDetails[0]);
    let userCompleteDetails = await userDetailsDB.find({
      "user.uid": tempUserId,
    });
    completeOrderDetails.push(userCompleteDetails[0]);
    data.push(completeOrderDetails);
  }

  if (data) {
    res.json({
      msg: "All Orders info ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all orders info.",
      data: [],
      status: -1,
    });
  }
});

router.get("/getallorders", async (req, res) => {
  let data = [];
  let orders = await orderDetailsDB.find({});
  for (let i = 0; i < orders.length; i++) {
    let completeOrderDetails = [];
    completeOrderDetails.push(orders[i]);
    let tempProductId = orders[i].productId;
    let tempUserId = orders[i].user.uid;
    let productDetails = await productDB.find({ _id: tempProductId });
    completeOrderDetails.push(productDetails[0]);
    let userCompleteDetails = await userDetailsDB.find({
      "user.uid": tempUserId,
    });
    completeOrderDetails.push(userCompleteDetails[0]);
    data.push(completeOrderDetails);
  }

  if (data) {
    res.json({
      msg: "All Orders info ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all orders info.",
      data: [],
      status: -1,
    });
  }
});
module.exports = router;
