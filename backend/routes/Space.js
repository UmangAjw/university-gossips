const express = require("express");
const multer = require("multer");

const router = express.Router();

const spaceDB = require("../models/Space");
const questionDB = require("../models/Question");
const answerDB = require("../models/Answer");
const userDetailsDB = require("../models/UserDetails");
const upload = multer({ dest: "frontend/public/img/spaceprofilepics" });

router.post("/", async (req, res) => {
  const now = new Date();
  const secondsSinceEpoch = Math.round(now.getTime() / 1000);
  try {
    await spaceDB
      .create({
        spaceName: req.body.spaceName,
        spaceDesc: req.body.spaceDesc,
        spaceProfilePic: req.body.spaceProfilePic,
        user: req.body.user,
        slug: req.body.slug,
        followers: req.body.followers,
        followersWithTime: req.body.followersWithTime,
        moderators: req.body.moderators,
        createdAt: secondsSinceEpoch,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Space created successfully",
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
      message: "Error while creating space",
    });
  }
});

router.delete("/deletebyid/:spaceId", async (req, res) => {
  spaceDB.deleteOne({ _id: req.params.spaceId }, (err, data) => {
    if (err) {
      res.json({ data: err, msg: "SMW", status: -1 });
    } else {
      if (data.deletedCount == 0) {
        res.json({
          data: req.params,
          msg: "Invalid space id!",
          status: 200,
        });
      } else {
        res.json({
          data: data,
          msg: "Space Deleted Successfully!",
          status: 200,
        });
      }
    }
  });
});

router.post(
  "/uploadspaceprofilepic",
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

// router.get("/", async (req, res) => {
//   try {
//     await spaceDB.find(function (err, data) {
//       if (err) {
//         res.json({ data: err, status: -1, msg: "SMWR" });
//       } else {
//         res.json({ data: data, status: 200, msg: "User retrieved" });
//       }
//     });
//   } catch {}
// });

router.get("/", async (req, res) => {
  try {
    await spaceDB
      .aggregate([
        {
          $lookup: {
            from: "questions", // collection to join
            localField: "slug", // field from input document
            foreignField: "spaceName",
            as: "allQuestions",
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
      ])
      .exec()
      .then((doc) => {
        res.status(200).send(doc);
      })
      .catch((err) => {
        res.status(500).send({
          status: false,
          message: "Unable to get the space questions",
        });
      });
  } catch {
    res.status(500).send({
      status: false,
      message: "Unexpected error!",
    });
  }
});

router.get("/eachSpace/:slug", async (req, res) => {
  let data = [];
  let questions = await questionDB.find({ spaceName: req.params.slug });
  let spaceInfo = await spaceDB.find({ slug: req.params.slug });

  for (let i = 0; i < questions.length; i++) {
    let post = [];
    post.push(questions[i]);
    let idOfQuestion = questions[i]._id;
    let userIdOfQuestion = questions[i].user.uid;
    let answers = await answerDB.find({ questionId: idOfQuestion });
    post.push(answers);
    let questionUserDetails = [
      await userDetailsDB.findOne({
        "user.uid": userIdOfQuestion,
      }),
    ];
    post.push(questionUserDetails);
    data.push(post);
  }
  if (data) {
    res.json({
      msg: "Question ret...",
      data: [data, spaceInfo],
      status: 200,
    });
  } else {
    res.json({
      msg: "Invalid slug.",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/eachSpace2/:slug", async (req, res) => {
  let data = [];
  let spaceInfo = await spaceDB.find({ slug: req.params.slug });

  if (data) {
    res.json({
      msg: "Question ret...",
      data: [data, spaceInfo],
      status: 200,
    });
  } else {
    res.json({
      msg: "Invalid slug.",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/eachSpaceQuestionDetails/:slug", async (req, res) => {
  let data = [];
  let questions = await questionDB.find({ spaceName: req.params.slug });
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

router.get("/getallspacesonly", async (req, res) => {
  let data = await spaceDB.find({});
  if (data) {
    res.json({
      msg: "Spaces info ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve spaces info .",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getFollowers/:spaceSlug", async (req, res) => {
  let data = await spaceDB.find({ slug: req.params.spaceSlug });
  let followers;
  if (data && data.length !== 0) followers = data[0].followers;
  else followers = data;
  if (data) {
    res.json({
      msg: "Spaces followers ret...",
      data: followers,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve spaces info .",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getFollowersWithTime/:spaceSlug", async (req, res) => {
  let data = await spaceDB.find({ slug: req.params.spaceSlug });
  let followersWithTime;

  if (data && data.length !== 0) followersWithTime = data[0].followersWithTime;
  else followersWithTime = data;
  if (data) {
    res.json({
      msg: "Spaces followers ret...",
      data: followersWithTime,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve spaces info .",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getModerators/:spaceSlug", async (req, res) => {
  let data = await spaceDB.find({ slug: req.params.spaceSlug });
  if (data) {
    res.json({
      msg: "Spaces moderators ret...",
      data: data[0].moderators,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve spaces info .",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getModeratorsObject/:spaceSlug", async (req, res) => {
  let data = await spaceDB.find({ slug: req.params.spaceSlug });
  let allModeratorsID = data[0].moderators;

  let allModeratorsObject = await userDetailsDB.find({
    "user.uid": { $in: allModeratorsID },
  });

  // for (let i = 0; i < allModeratorsID.length; i++) {
  //   let eachModeratorId = allModeratorsID[i];
  //   let tempModeratorObject = userDetailsDB.findOne({
  //     "user.uid": eachModeratorId,
  //   });
  //   if (tempModeratorObject) allModeratorsObject.push(tempModeratorObject);
  // }

  if (data) {
    res.json({
      msg: "Spaces moderators ret...",
      data: allModeratorsObject,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve spaces info .",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getspacesbyfollower/:userId", async (req, res) => {
  let datas = await spaceDB.find({});
  let data = [];
  datas.forEach((element) => {
    if (element.followers.includes(req.params.userId)) {
      data.push(element);
    }
  });
  if (data) {
    res.json({
      msg: "Spaces followers ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve spaces info .",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getNotificationContents/:userId", async (req, res) => {
  let allSpaces = await spaceDB.find({});
  let requiredData = [];
  // let testing = [];

  for (let eachSpace of allSpaces) {
    if (eachSpace.followers.includes(req.params.userId)) {
      let timeofFollowing = eachSpace.followersWithTime[req.params.userId];

      let allQuestionsInSpace = await questionDB.find({
        spaceName: eachSpace.slug,
      });
      // testing.push(allQuestionsInSpace);

      for (let eachQuestion of allQuestionsInSpace) {
        let eachRequiredData = {};
        if (eachQuestion.createdAt > timeofFollowing) {
          eachRequiredData["spaceProfilePic"] = eachSpace.spaceProfilePic;
          eachRequiredData["spaceName"] = eachSpace.spaceName;
          eachRequiredData["questionCreatedAt"] = eachQuestion.createdAt;
          eachRequiredData["questionName"] = eachQuestion.questionName;
          eachRequiredData["questionSlug"] = eachQuestion.slug;
          requiredData.push(eachRequiredData);
        }
      }
    }
  }
  if (requiredData) {
    res.json({
      msg: "Notifications content ret...",
      data: requiredData,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve spaces info .",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getFollowingContents/:userId", async (req, res) => {
  let allSpaces = await spaceDB.find({});
  let requiredData = [];

  for (let eachSpace of allSpaces) {
    if (eachSpace.followers.includes(req.params.userId)) {
      let allQuestionsOfEachSpace = await questionDB.find({
        spaceName: eachSpace.slug,
      });

      for (let eachQuestionOfEachSpace of allQuestionsOfEachSpace) {
        let post = [];
        let questionArr = [];

        questionArr.push(eachQuestionOfEachSpace);

        let userIdOfEachQuestion = eachQuestionOfEachSpace.user.uid;
        let userDetailsOfEachQuestion = await userDetailsDB.findOne({
          "user.uid": userIdOfEachQuestion,
        });

        questionArr.push(userDetailsOfEachQuestion);

        post.push(questionArr);

        let idOfQuestion = eachQuestionOfEachSpace._id;
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
        requiredData.push(post);
      }
    }
  }

  if (requiredData) {
    res.json({
      msg: "Notifications content ret...",
      data: [requiredData],
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve spaces info .",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getonlyspacedetailsbyslug/:slug", async (req, res) => {
  let data = await spaceDB.findOne({ slug: req.params.slug });

  if (data) {
    res.json({
      msg: "Space details ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve spaces info .",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getspacesbyowner/:userId", async (req, res) => {
  let data = await spaceDB.find({ "user.uid": req.params.userId });

  if (data) {
    res.json({
      msg: "Spaces followers ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve spaces info .",
      data: req.params,
      status: -1,
    });
  }
});

router.put("/updateSpace/:spaceSlug", async (req, res) => {
  let data = await spaceDB.updateOne({ slug: req.params.spaceSlug }, req.body);
  console.log(data);
  if (data) {
    res.json({ msg: "Space ret...", data: data, status: 200 });
  } else {
    res.json({
      msg: "Invalid answer id.",
      data: req.params,
      status: -1,
    });
  }
});

module.exports = router;
