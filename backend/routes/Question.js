const express = require("express");
const router = express.Router();

const questionDB = require("../models/Question");
const userDetailsDB = require("../models/UserDetails");

const answerDB = require("../models/Answer");

router.post("/", async (req, res) => {
  console.log("inside", req.body);
  const now = new Date();
  const secondsSinceEpoch = Math.round(now.getTime() / 1000);

  try {
    await questionDB
      .create({
        questionName: req.body.questionName,
        questionUrl: req.body.questionUrl,
        user: req.body.user,
        createdAt: secondsSinceEpoch,
        slug: req.body.slug,
        spaceName: req.body.spaceName,
        questionType: req.body.questionType,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Question added successfully",
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: "Bad format",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Error while adding question",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    await questionDB
      .aggregate([
        {
          $lookup: {
            from: "answers", // collection to join
            localField: "_id", // field from input document
            foreignField: "questionId",
            as: "allAnswers",
          },
          // pipeline: [
          //   {
          //     $lookup: {
          //       from: "userdetails", // collection to join
          //       localField: "allAnswers.user", // field from input document
          //       foreignField: "user",
          //       as: "userCompleteDetailsOfEachAnswer",
          //     },
          //   },
          // ],
        },
        // {
        //   $unwind: "$allAnswers",
        // },
        // {
        //   $lookup: {
        //     from: "userdetails", // collection to join
        //     localField: "allAnswers.user", // field from input document
        //     foreignField: "user",
        //     as: "allAnswers.userCompleteDetailsOfEachAnswer",
        //   },
        // },
        {
          $lookup: {
            from: "userdetails", // collection to join
            localField: "user", // field from input document
            foreignField: "user",
            as: "userCompleteDetails",
          },
        },
      ])
      .exec()
      .then((doc) => {
        res.status(200).send(doc);
      })
      .catch((err) => {
        res.status(500).send({
          status: false,
          message: "Unable to get the question details",
        });
      });
  } catch {
    res.status(500).send({
      status: false,
      message: "Unexpected error!",
    });
  }
});

router.get(
  "/findquestionspagebypage/:pageNumber/:nPerPage",
  async (req, res) => {
    let totalQuestions = await questionDB.count();
    let pageNumber = parseInt(req.params.pageNumber);
    let nPerPage = parseInt(req.params.nPerPage);
    let totalPages = parseInt(totalQuestions / nPerPage) + 1;
    // pageNumber = totalPages - pageNumber + 1;
    try {
      await questionDB
        .aggregate([
          {
            $lookup: {
              from: "answers", // collection to join
              localField: "_id", // field from input document
              foreignField: "questionId",
              as: "allAnswers",
            },
          },
          {
            $lookup: {
              from: "userdetails", // collection to join
              localField: "user", // field from input document
              foreignField: "user",
              as: "userCompleteDetails",
            },
          },
          { $sort: { createdAt: -1 } },
        ])
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage)
        .exec()
        .then((doc) => {
          res.status(200).send(doc);
        })
        .catch((err) => {
          res.status(500).send({
            status: false,
            message: "Unable to get the question details",
          });
        });
    } catch {
      res.status(500).send({
        status: false,
        message: "Unexpected error!",
      });
    }
  }
);

router.get(
  "/findquestionspagebypage2/:pageNumber/:nPerPage",
  async (req, res) => {
    let totalQuestions = await questionDB.count();
    let pageNumber = parseInt(req.params.pageNumber);
    let nPerPage = parseInt(req.params.nPerPage);
    let totalPages = parseInt(totalQuestions / nPerPage) + 1;
    // pageNumber = totalPages - pageNumber + 1;
    try {
      await questionDB
        .aggregate([
          {
            $lookup: {
              from: "answers", // collection to join
              localField: "_id", // field from input document
              foreignField: "questionId",
              as: "allAnswers",
            },
          },
          {
            $unwind: "$allAnswers",
          },
          {
            $project: {
              answer: 1,
              voters: 1,
              voteCounter: 1,
              questionId: 1,
              createdAt: 1,
              user: 1,
            },
          },
          {
            $lookup: {
              from: "userdetails", // collection to join
              localField: "user", // field from input document
              foreignField: "user",
              as: "userCompleteDetails",
            },
          },
          { $sort: { createdAt: -1 } },
        ])
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage)
        .exec()
        .then((doc) => {
          res.status(200).send(doc);
        })
        .catch((err) => {
          res.status(500).send({
            status: false,
            message: "Unable to get the question details",
          });
        });
    } catch {
      res.status(500).send({
        status: false,
        message: "Unexpected error!",
      });
    }
  }
);

router.get(
  "/findquestionspagebypage3/:pageNumber/:nPerPage",
  async (req, res) => {
    // let tempdata = [];

    let totalQuestions = await questionDB.count();
    let pageNumber = parseInt(req.params.pageNumber);
    let nPerPage = parseInt(req.params.nPerPage);
    let totalPages = parseInt(totalQuestions / nPerPage) + 1;

    // tempdata.push(totalQuestions, pageNumber, nPerPage, totalPages);

    // pageNumber = totalPages - pageNumber + 1;

    let data = [];

    let questions = await questionDB
      .find({})
      .sort({ createdAt: -1 })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage);

    // tempdata.push(questions);
    for (let i = 0; i < questions.length; i++) {
      let post = [];
      let questionArr = [];

      questionArr.push(questions[i]);

      let userIdOfEachQuestion = questions[i].user.uid;
      let userDetailsOfEachQuestion = await userDetailsDB.findOne({
        "user.uid": userIdOfEachQuestion,
      });

      questionArr.push(userDetailsOfEachQuestion);

      post.push(questionArr);

      let idOfQuestion = questions[i]._id;
      let answers = await answerDB.find({ questionId: idOfQuestion });

      let answersWithCompleteDetails = [];
      for (let i = 0; i < answers.length; i++) {
        let eachAnswer = answers[i];

        let userIdOfEachAnswer = answers[i].user.uid;
        let userDetailsOfEachAnswer = await userDetailsDB.findOne({
          "user.uid": userIdOfEachAnswer,
        });
        // eachAnswer["userDetails"] = userDetailsOfEachAnswer;
        let userDetailsObj = { userDetails: userDetailsOfEachAnswer };
        // eachAnswer = { ...eachAnswer, ...userDetailsObj };

        // Object.assign(eachAnswer, userDetailsObj);

        let JSONObj = JSON.parse(JSON.stringify(eachAnswer));

        JSONObj.userDetails = userDetailsOfEachAnswer;

        // Object.defineProperty(
        //   eachAnswer,
        //   "userDetails",
        //   userDetailsOfEachAnswer
        // );

        answersWithCompleteDetails.push(JSONObj);
      }

      post.push(answersWithCompleteDetails);
      data.push(post);
    }

    if (data) {
      res.json({
        msg: "Single user info ret...",
        data: data,
        status: 200,
      });
    } else {
      res.json({
        msg: "Cannot retrieve all users info.",
        data: [],
        status: -1,
      });
    }
  }
);

router.get("/gettotalpages/:nPerPage", async (req, res) => {
  let totalQuestions = await questionDB.count();
  let nPerPage = parseInt(req.params.nPerPage);
  let data = parseInt(totalQuestions / nPerPage) + 1;
  if (data) {
    res.json({
      msg: "Total questions ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Error while getting total questions",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/gettotalquestions/", async (req, res) => {
  let data = await questionDB.count();
  if (data) {
    res.json({
      msg: "Total questions ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Error while getting total questions",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/find/:questionId", async (req, res) => {
  let data = await questionDB.find({ _id: req.params.questionId });
  let dataWithAnswers = await answerDB.find({
    questionId: req.params.questionId,
  });
  if (data) {
    res.json({
      msg: "Question ret...",
      data: [data, dataWithAnswers],
      status: 200,
    });
  } else {
    res.json({
      msg: "Invalid user id.",
      data: req.params,
      status: -1,
    });
  }
});

router.put("/updateQuestion/:questionId", async (req, res) => {
  let data = await questionDB.findOneAndUpdate(
    { _id: req.params.questionId },
    req.body,
    { new: true }
  );
  console.log(data);
  if (data) {
    res.json({ msg: "Question updated ret...", data: data, status: 200 });
  } else {
    res.json({
      msg: "Invalid question id.",
      data: req.params,
      status: -1,
    });
  }
});

router.delete("/deletebyid/:questionId", async (req, res) => {
  questionDB.deleteOne({ _id: req.params.questionId }, (err, data) => {
    if (err) {
      res.json({ data: err, msg: "SMW", status: -1 });
    } else {
      if (data.deletedCount == 0) {
        res.json({
          data: req.params,
          msg: "Invalid question id!",
          status: 200,
        });
      } else {
        res.json({
          data: data,
          msg: "Question Deleted Successfully!",
          status: 200,
        });
      }
    }
  });
});

router.delete("/deleteallbyid/:questionId", async (req, res) => {
  answerDB.deleteMany({ questionId: req.params.questionId }, (err, data) => {
    if (err) {
      res.json({ data: err, msg: "SMW", status: -1 });
    } else {
      if (data.deletedCount == 0) {
        res.json({
          data: req.params,
          msg: "Invalid question id!",
          status: 200,
        });
      } else {
        res.json({
          data: data,
          msg: "All answers deleted Successfully!",
          status: 200,
        });
      }
    }
  });
});

router.get("/findbyslug/:slug", async (req, res) => {
  let data = await questionDB.find({ slug: req.params.slug });
  let dataWithAnswers;
  if (data && data.length !== 0) {
    dataWithAnswers = await answerDB.find({
      questionId: data[0]._id,
    });
  }
  if (data) {
    res.json({
      msg: "User ret...",
      data: [data, dataWithAnswers],
      status: 200,
    });
  } else {
    res.json({
      msg: "Invalid user id.",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/findbyslug2/:slug", async (req, res) => {
  let data = [];

  let questions = await questionDB.find({ slug: req.params.slug });
  for (let i = 0; i < questions.length; i++) {
    let post = [];
    let questionArr = [];

    questionArr.push(questions[i]);

    let userIdOfEachQuestion = questions[i].user.uid;
    let userDetailsOfEachQuestion = await userDetailsDB.findOne({
      "user.uid": userIdOfEachQuestion,
    });

    questionArr.push(userDetailsOfEachQuestion);

    post.push(questionArr);

    let idOfQuestion = questions[i]._id;
    let answers = await answerDB.find({ questionId: idOfQuestion });

    let answersWithCompleteDetails = [];
    for (let i = 0; i < answers.length; i++) {
      let eachAnswer = answers[i];

      let userIdOfEachAnswer = answers[i].user.uid;
      let userDetailsOfEachAnswer = await userDetailsDB.findOne({
        "user.uid": userIdOfEachAnswer,
      });
      // eachAnswer["userDetails"] = userDetailsOfEachAnswer;
      let userDetailsObj = { userDetails: userDetailsOfEachAnswer };
      // eachAnswer = { ...eachAnswer, ...userDetailsObj };

      // Object.assign(eachAnswer, userDetailsObj);

      let JSONObj = JSON.parse(JSON.stringify(eachAnswer));

      JSONObj.userDetails = userDetailsOfEachAnswer;

      // Object.defineProperty(
      //   eachAnswer,
      //   "userDetails",
      //   userDetailsOfEachAnswer
      // );

      answersWithCompleteDetails.push(JSONObj);
    }

    post.push(answersWithCompleteDetails);
    data.push(post);
  }

  if (data) {
    res.json({
      msg: "Single user info ret...",
      data: [data],
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all users info.",
      data: [],
      status: -1,
    });
  }
});

router.get("/findbyuser/:userId", async (req, res) => {
  let data = [];
  let questions = await questionDB.find({ "user.uid": req.params.userId });
  for (let i = 0; i < questions.length; i++) {
    let post = [];
    post.push(questions[i]);
    let idOfQuestion = questions[i]._id;
    let answers = await answerDB.find({ questionId: idOfQuestion });
    post.push(answers);
    data.push(post);
  }
  if (data) {
    res.json({
      msg: "User ret...",
      data: [data],
      status: 200,
    });
  } else {
    res.json({
      msg: "Invalid user id.",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/findbyuser2/:userId", async (req, res) => {
  let tempUser = req.params.userId;

  let data = [];
  if (tempUser) {
    let tempUserId = tempUser;
    let questions = await questionDB.find({ "user.uid": tempUserId });
    for (let i = 0; i < questions.length; i++) {
      let post = [];
      let questionArr = [];

      questionArr.push(questions[i]);

      let userIdOfEachQuestion = questions[i].user.uid;
      let userDetailsOfEachQuestion = await userDetailsDB.findOne({
        "user.uid": userIdOfEachQuestion,
      });

      questionArr.push(userDetailsOfEachQuestion);

      post.push(questionArr);

      let idOfQuestion = questions[i]._id;
      let answers = await answerDB.find({ questionId: idOfQuestion });

      let answersWithCompleteDetails = [];
      for (let i = 0; i < answers.length; i++) {
        let eachAnswer = answers[i];

        let userIdOfEachAnswer = answers[i].user.uid;
        let userDetailsOfEachAnswer = await userDetailsDB.findOne({
          "user.uid": userIdOfEachAnswer,
        });
        // eachAnswer["userDetails"] = userDetailsOfEachAnswer;
        let userDetailsObj = { userDetails: userDetailsOfEachAnswer };
        // eachAnswer = { ...eachAnswer, ...userDetailsObj };

        // Object.assign(eachAnswer, userDetailsObj);

        let JSONObj = JSON.parse(JSON.stringify(eachAnswer));

        JSONObj.userDetails = userDetailsOfEachAnswer;

        // Object.defineProperty(
        //   eachAnswer,
        //   "userDetails",
        //   userDetailsOfEachAnswer
        // );

        answersWithCompleteDetails.push(JSONObj);
      }

      post.push(answersWithCompleteDetails);
      data.push(post);
    }
  }

  if (tempUser && data) {
    res.json({
      msg: "Single user info ret...",
      data: [data],
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all users info.",
      data: [],
      status: -1,
    });
  }
});

router.get("/findbyusername/:username", async (req, res) => {
  let tempUser = await userDetailsDB.findOne({ username: req.params.username });

  let data = [];
  if (tempUser && tempUser.user && tempUser.user.uid) {
    let tempUserId = tempUser.user.uid;
    let questions = await questionDB.find({ "user.uid": tempUserId });
    for (let i = 0; i < questions.length; i++) {
      let post = [];
      post.push(questions[i]);
      let idOfQuestion = questions[i]._id;
      let answers = await answerDB.find({ questionId: idOfQuestion });
      post.push(answers);
      data.push(post);
    }
  }

  if (tempUser && data) {
    res.json({
      msg: "Single user info ret...",
      data: [data],
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all users info.",
      data: [],
      status: -1,
    });
  }
});

router.get("/findbyusername2/:username", async (req, res) => {
  let tempUser = await userDetailsDB.findOne({ username: req.params.username });

  let data = [];
  if (tempUser && tempUser.user && tempUser.user.uid) {
    let tempUserId = tempUser.user.uid;
    let questions = await questionDB.find({ "user.uid": tempUserId });
    for (let i = 0; i < questions.length; i++) {
      let post = [];
      let questionArr = [];

      questionArr.push(questions[i]);

      let userIdOfEachQuestion = questions[i].user.uid;
      let userDetailsOfEachQuestion = await userDetailsDB.findOne({
        "user.uid": userIdOfEachQuestion,
      });

      questionArr.push(userDetailsOfEachQuestion);

      post.push(questionArr);

      let idOfQuestion = questions[i]._id;
      let answers = await answerDB.find({ questionId: idOfQuestion });

      let answersWithCompleteDetails = [];
      for (let i = 0; i < answers.length; i++) {
        let eachAnswer = [];

        eachAnswer.push(answers[i]);
        let userIdOfEachAnswer = answers[i].user.uid;
        let userDetailsOfEachAnswer = await userDetailsDB.findOne({
          "user.uid": userIdOfEachAnswer,
        });
        eachAnswer.push(userDetailsOfEachAnswer);
        answersWithCompleteDetails.push(eachAnswer);
      }

      post.push(answersWithCompleteDetails);
      data.push(post);
    }
  }

  if (tempUser && data) {
    res.json({
      msg: "Single user info ret...",
      data: [data],
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all users info.",
      data: [],
      status: -1,
    });
  }
});

router.get("/findbyusername3/:username", async (req, res) => {
  let tempUser = await userDetailsDB.findOne({ username: req.params.username });

  let data = [];
  if (tempUser && tempUser.user && tempUser.user.uid) {
    let tempUserId = tempUser.user.uid;
    let questions = await questionDB.find({ "user.uid": tempUserId });
    for (let i = 0; i < questions.length; i++) {
      let post = [];
      let questionArr = [];

      questionArr.push(questions[i]);

      let userIdOfEachQuestion = questions[i].user.uid;
      let userDetailsOfEachQuestion = await userDetailsDB.findOne({
        "user.uid": userIdOfEachQuestion,
      });

      questionArr.push(userDetailsOfEachQuestion);

      post.push(questionArr);

      let idOfQuestion = questions[i]._id;
      let answers = await answerDB.find({ questionId: idOfQuestion });

      let answersWithCompleteDetails = [];
      for (let i = 0; i < answers.length; i++) {
        let eachAnswer = answers[i];

        let userIdOfEachAnswer = answers[i].user.uid;
        let userDetailsOfEachAnswer = await userDetailsDB.findOne({
          "user.uid": userIdOfEachAnswer,
        });
        // eachAnswer["userDetails"] = userDetailsOfEachAnswer;
        let userDetailsObj = { userDetails: userDetailsOfEachAnswer };
        // eachAnswer = { ...eachAnswer, ...userDetailsObj };

        // Object.assign(eachAnswer, userDetailsObj);

        let JSONObj = JSON.parse(JSON.stringify(eachAnswer));

        JSONObj.userDetails = userDetailsOfEachAnswer;

        // Object.defineProperty(
        //   eachAnswer,
        //   "userDetails",
        //   userDetailsOfEachAnswer
        // );

        answersWithCompleteDetails.push(JSONObj);
      }

      post.push(answersWithCompleteDetails);
      data.push(post);
    }
  }

  if (tempUser && data) {
    res.json({
      msg: "Single user info ret...",
      data: [data],
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all users info.",
      data: [],
      status: -1,
    });
  }
});

router.get("/findanswerbyuser/:userId", async (req, res) => {
  let data = [];
  let questions = await questionDB.find({});
  for (let i = 0; i < questions.length; i++) {
    let post = [];
    let idOfQuestion = questions[i]._id;
    let answers = await answerDB.find({ questionId: idOfQuestion });

    for (let j = 0; j < answers.length; j++) {
      if (answers[j].user.uid == req.params.userId) {
        post.push(questions[i]);
        post.push(answers);
        break;
      }
    }

    if (post.length !== 0) data.push(post);
  }
  if (data) {
    res.json({
      msg: "User ret...",
      data: [data],
      status: 200,
    });
  } else {
    res.json({
      msg: "Invalid user id.",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/findanswerbyuser2/:userId", async (req, res) => {
  let tempUser = req.params.userId;

  let testing = [];
  let testingCount = 0;

  let data = [];
  if (tempUser) {
    let tempUserId = tempUser;

    let questions = await questionDB.find({});

    for (let i = 0; i < questions.length; i++) {
      let post = [];
      let questionArr = [];

      questionArr.push(questions[i]);

      let userIdOfEachQuestion = questions[i].user.uid;
      let userDetailsOfEachQuestion = await userDetailsDB.findOne({
        "user.uid": userIdOfEachQuestion,
      });

      questionArr.push(userDetailsOfEachQuestion);

      let idOfQuestion = questions[i]._id;
      let answers = await answerDB.find({ questionId: idOfQuestion });

      // let userHasAnsweredQuestion = await answerDB.findOne({
      //   "user.uid": tempUserId,
      // });

      let userHasAnsweredQuestion = answers.find(
        (ea) => ea.user.uid === tempUserId
      );

      // testing.push(questions[i]);
      // testing.push(userHasAnsweredQuestion);
      // testing.push("----------");

      if (userHasAnsweredQuestion !== undefined) {
        // if (Object.keys(userHasAnsweredQuestion).length !== 0) {
        let answersWithCompleteDetails = [];

        post.push(questionArr);
        for (let i = 0; i < answers.length; i++) {
          let eachAnswer = answers[i];

          let userIdOfEachAnswer = answers[i].user.uid;
          let userDetailsOfEachAnswer = await userDetailsDB.findOne({
            "user.uid": userIdOfEachAnswer,
          });
          // eachAnswer["userDetails"] = userDetailsOfEachAnswer;
          let userDetailsObj = { userDetails: userDetailsOfEachAnswer };
          // eachAnswer = { ...eachAnswer, ...userDetailsObj };

          // Object.assign(eachAnswer, userDetailsObj);

          let JSONObj = JSON.parse(JSON.stringify(eachAnswer));

          JSONObj.userDetails = userDetailsOfEachAnswer;

          // Object.defineProperty(
          //   eachAnswer,
          //   "userDetails",
          //   userDetailsOfEachAnswer
          // );

          answersWithCompleteDetails.push(JSONObj);
        }

        post.push(answersWithCompleteDetails);
        data.push(post);
      } else {
        continue;
      }
      testingCount++;
    }
  }

  if (tempUser && data) {
    res.json({
      msg: "Single user info ret...",
      data: [data],
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all users info.",
      data: [],
      status: -1,
    });
  }
});

router.get("/findanswerbyusername/:username", async (req, res) => {
  let tempUser = await userDetailsDB.findOne({ username: req.params.username });

  let testing = [];
  let testingCount = 0;

  let data = [];
  if (tempUser && tempUser.user && tempUser.user.uid) {
    let tempUserId = tempUser.user.uid;

    let questions = await questionDB.find({});

    for (let i = 0; i < questions.length; i++) {
      let post = [];
      let questionArr = [];

      questionArr.push(questions[i]);

      let userIdOfEachQuestion = questions[i].user.uid;
      let userDetailsOfEachQuestion = await userDetailsDB.findOne({
        "user.uid": userIdOfEachQuestion,
      });

      questionArr.push(userDetailsOfEachQuestion);

      let idOfQuestion = questions[i]._id;
      let answers = await answerDB.find({ questionId: idOfQuestion });

      // let userHasAnsweredQuestion = await answerDB.findOne({
      //   "user.uid": tempUserId,
      // });

      let userHasAnsweredQuestion = answers.find(
        (ea) => ea.user.uid === tempUserId
      );

      // testing.push(questions[i]);
      // testing.push(userHasAnsweredQuestion);
      // testing.push("----------");

      if (userHasAnsweredQuestion !== undefined) {
        // if (Object.keys(userHasAnsweredQuestion).length !== 0) {
        let answersWithCompleteDetails = [];

        post.push(questionArr);
        for (let i = 0; i < answers.length; i++) {
          let eachAnswer = answers[i];

          let userIdOfEachAnswer = answers[i].user.uid;
          let userDetailsOfEachAnswer = await userDetailsDB.findOne({
            "user.uid": userIdOfEachAnswer,
          });
          // eachAnswer["userDetails"] = userDetailsOfEachAnswer;
          let userDetailsObj = { userDetails: userDetailsOfEachAnswer };
          // eachAnswer = { ...eachAnswer, ...userDetailsObj };

          // Object.assign(eachAnswer, userDetailsObj);

          let JSONObj = JSON.parse(JSON.stringify(eachAnswer));

          JSONObj.userDetails = userDetailsOfEachAnswer;

          // Object.defineProperty(
          //   eachAnswer,
          //   "userDetails",
          //   userDetailsOfEachAnswer
          // );

          answersWithCompleteDetails.push(JSONObj);
        }

        post.push(answersWithCompleteDetails);
        data.push(post);
      } else {
        continue;
      }
      testingCount++;
    }
  }

  if (tempUser && data) {
    res.json({
      msg: "Single user info ret...",
      data: [data],
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all users info.",
      data: [],
      status: -1,
    });
  }
});

module.exports = router;
