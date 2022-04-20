const express = require("express");
const multer = require("multer");

const router = express.Router();

const spaceDB = require("../models/Space");
const questionDB = require("../models/Question");
const answerDB = require("../models/Answer");
const userDetailsDB = require("../models/UserDetails");
const productDB = require("../models/Product");
const upload = multer({ dest: "frontend/public/img/productprofilepics" });

router.post("/", async (req, res) => {
  const now = new Date();
  const secondsSinceEpoch = Math.round(now.getTime() / 1000);
  try {
    await productDB
      .create({
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productDesc: req.body.productDesc,
        user: req.body.user,
        slug: req.body.slug,
        productStock: req.body.productStock,
        productProfilePic: req.body.productProfilePic,
        orders: req.body.orders,
        createdAt: secondsSinceEpoch,
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

router.delete("/deletebyid/:productId", async (req, res) => {
  productDB.deleteOne({ _id: req.params.productId }, (err, data) => {
    if (err) {
      res.json({ data: err, msg: "SMW", status: -1 });
    } else {
      if (data.deletedCount == 0) {
        res.json({
          data: req.params,
          msg: "Invalid product id!",
          status: 200,
        });
      } else {
        res.json({
          data: data,
          msg: "Product Deleted Successfully!",
          status: 200,
        });
      }
    }
  });
});

router.post(
  "/uploadproductprofilepic",
  upload.single("image"),
  async (req, res) => {
    const imagePath = req.file.path;
    if (imagePath) {
      res.send({ imagePath });
    } else {
      res.send("Error in uploading profile pic");
    }
  }
);

router.get("/", async (req, res) => {
  let data = await productDB.find({});
  if (data) {
    res.json({
      msg: "Products info ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve products info .",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getproductbyslug/:slug", async (req, res) => {
  let data = await productDB.find({ slug: req.params.slug });
  if (data) {
    res.json({
      msg: "Each Products info ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve each products info .",
      data: req.params,
      status: -1,
    });
  }
});

module.exports = router;
