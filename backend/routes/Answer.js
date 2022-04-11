const express = require("express");
const router = express.Router();

const answerDB = require("../models/Answer");
const questionDB = require("../models/Question");

router.post("/", async (req, res) => {
  const now = new Date();
  const secondsSinceEpoch = Math.round(now.getTime() / 1000);
  try {
    await answerDB
      .create({
        answer: req.body.answer,
        voteCounter: req.body.voteCounter,
        questionId: req.body.questionId,
        user: req.body.user,
        voters: req.body.voters,
        createdAt: secondsSinceEpoch,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Answer Added successfully",
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
      message: "Error while adding answer",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    await answerDB.find(function (err, data) {
      if (err) {
        res.json({ data: err, status: -1, msg: "SMWR" });
      } else {
        res.json({ data: data, status: 200, msg: "User retrieved" });
      }
    });
  } catch {}
});

router.get("/findAnswer/:answerId", async (req, res) => {
  let data = await answerDB.findOne({ _id: req.params.answerId });

  if (data) {
    res.json({ msg: "User ret...", data: data, status: 200 });
  } else {
    res.json({
      msg: "Invalid answer id.",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/findAnswerByQuestion/:questionId", async (req, res) => {
  let data = await answerDB.find({ questionId: req.params.questionId });

  if (data) {
    res.json({ msg: "User ret...", data: data, status: 200 });
  } else {
    res.json({
      msg: "Invalid answer id.",
      data: req.params,
      status: -1,
    });
  }
});

router.put("/updateAnswer/:answerId", async (req, res) => {
  let data = await answerDB.findOneAndUpdate(
    { _id: req.params.answerId },
    req.body,
    { new: true }
  );
  console.log(data);
  if (data) {
    res.json({ msg: "User ret...", data: data, status: 200 });
  } else {
    res.json({
      msg: "Invalid answer id.",
      data: req.params,
      status: -1,
    });
  }
});

router.delete("/deletebyid/:answerId", async (req, res) => {
  answerDB.deleteOne({ _id: req.params.answerId }, (err, data) => {
    if (err) {
      res.json({ data: err, msg: "SMW", status: -1 });
    } else {
      if (data.deletedCount == 0) {
        res.json({
          data: req.params,
          msg: "Invalid answer id!",
          status: 200,
        });
      } else {
        res.json({
          data: data,
          msg: "Answer Deleted Successfully!",
          status: 200,
        });
      }
    }
  });
});

module.exports = router;
