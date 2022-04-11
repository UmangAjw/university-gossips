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
  if (data) {
    res.json({
      msg: "Spaces followers ret...",
      data: data[0].followers,
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
