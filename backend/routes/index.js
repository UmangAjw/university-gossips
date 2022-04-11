const express = require("express");
const router = express.Router();

const questionRouter = require("./Question");
const answerRouter = require("./Answer");
const spaceRouter = require("./Space");
const userDetailsRouter = require("./UserDetails");
const productRouter = require("./Product");
const orderDetailsRouter = require("./Orderdetails");

router.get("/", (req, res) => {
  res.send("This API is reserved for u gossips");
});

router.use("/spaces", spaceRouter);
router.use("/questions", questionRouter);
router.use("/answers", answerRouter);
router.use("/userDetails", userDetailsRouter);
router.use("/products", productRouter);
router.use("/orderDetails", orderDetailsRouter);

module.exports = router;
