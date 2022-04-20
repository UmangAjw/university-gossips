const express = require("express");
const multer = require("multer");
const router = express.Router();

const userDetailsDB = require("../models/UserDetails");
const upload = multer({ dest: "frontend/public/img/userprofilepics" });
const questionDB = require("../models/Question");
const answerDB = require("../models/Answer");
const spaceDB = require("../models/Space");
const orderDetailsDB = require("../models/OrderDetails");

// const storage = () => {
//   multer.diskStorage({
//     destination: function (req, res, next) {
//       next(null, "../../public/img/userprofiles");
//     },
//     filename: (req, res, next) => {
//       next(null, Date.now() + path.extname(file.originalname));
//     },
//   });
// };
// const upload = multer({ storage: storage }).single("images/");
// upload(req, res, (e) => {
//   if (e) {
//   } else {
//     console.log(req.file.filename);
//     res.render("upload", {});
//   }
// }
// );

router.post("/", async (req, res) => {
  const now = new Date();
  const secondsSinceEpoch = Math.round(now.getTime() / 1000);
  try {
    await userDetailsDB
      .create({
        user: req.body.user,
        xp: req.body.xp,
        xpTransactions: req.body.xpTransactions,
        username: req.body.username,
        name: req.body.name,
        profilePic: req.body.profilePic,
        userBio: req.body.userBio,
        createdAt: secondsSinceEpoch,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "User added successfully",
        });
      })
      .catch((e) => {
        res.status(400).send({
          status: false,
          message: e + "Bad request",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Error while adding user",
    });
  }
});

// router.post("/uploadprofilepic", upload.single("image"), async (req, res) => {
//   const imagePath = req.file.path;
//   console.log(imagePath);
//   res.send({ imagePath });
// });
router.post("/uploadprofilepic", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;
  if (imagePath) {
    res.send({ imagePath });
  } else {
    res.send("Error in uploading profile pic");
  }
});

router.get("/getprofilepic/:imageName", (req, res) => {
  // do a bunch of if statements to make sure the user is
  // authorized to view this image, then

  const imageName = req.params.imageName;
  const readStream = fs.createReadStream(`images/${imageName}`);
  readStream.pipe(res);
});

router.get("/getallusers", async (req, res) => {
  let data = await userDetailsDB.find({});

  if (data) {
    res.json({
      msg: "All users info ret...",
      data: data,
      status: 200,
    });
  } else {
    res.json({
      msg: "Cannot retrieve all users info.",
      data: req.params,
      status: -1,
    });
  }
});

router.get("/getuserbyid/:userId", async (req, res) => {
  let data = await userDetailsDB.findOne({ "user.uid": req.params.userId });

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
});

router.get("/getuserbyusername/:username", async (req, res) => {
  let data = await userDetailsDB.findOne({ username: req.params.username });

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
});

router.put("/updateUserDetails/:userId", async (req, res) => {
  let data = await userDetailsDB.updateOne(
    { "user.uid": req.params.userId },
    req.body
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

// router.delete("/deletebyid/:userId", async (req, res) => {
//   await userDetailsDB
//     .deleteOne({ "user.uid": req.params.userId }, (err, data) => {
//       if (err) {
//         res.json({ data: err, msg: "SMW", status: -1 });
//       } else {
//         if (data.deletedCount == 0) {
//           res.json({
//             data: req.params,
//             msg: "Invalid user id!",
//             status: 200,
//           });
//         } else {
//           res.json({
//             data: data,
//             msg: "User Deleted Successfully!",
//             status: 200,
//           });
//         }
//       }
//     })
//     .clone();

//   await questionDB
//     .deleteMany({ "user.uid": req.params.userId }, (err, data) => {
//       if (err) {
//         res.json({ data: err, msg: "SMW", status: -1 });
//       } else {
//         if (data.deletedCount == 0) {
//           res.json({
//             data: req.params,
//             msg: "Invalid user id!",
//             status: 200,
//           });
//         } else {
//           res.json({
//             data: data,
//             msg: "Questions of deleted user deleted Successfully!",
//             status: 200,
//           });
//         }
//       }
//     })
//     .clone();

//   await answerDB
//     .deleteMany({ "user.uid": req.params.userId }, (err, data) => {
//       if (err) {
//         res.json({ data: err, msg: "SMW", status: -1 });
//       } else {
//         if (data.deletedCount == 0) {
//           res.json({
//             data: req.params,
//             msg: "Invalid question id!",
//             status: 200,
//           });
//         } else {
//           res.json({
//             data: data,
//             msg: "All answers of deleted user deleted Successfully!",
//             status: 200,
//           });
//         }
//       }
//     })
//     .clone();

//   await spaceDB
//     .deleteMany({ "user.uid": req.params.userId }, (err, data) => {
//       if (err) {
//         res.json({ data: err, msg: "SMW", status: -1 });
//       } else {
//         if (data.deletedCount == 0) {
//           res.json({
//             data: req.params,
//             msg: "Invalid question id!",
//             status: 200,
//           });
//         } else {
//           res.json({
//             data: data,
//             msg: "All answers deleted Successfully!",
//             status: 200,
//           });
//         }
//       }
//     })
//     .clone();

//   await orderDetailsDB
//     .deleteMany({ "user.uid": req.params.userId }, (err, data) => {
//       if (err) {
//         res.json({ data: err, msg: "SMW", status: -1 });
//       } else {
//         if (data.deletedCount == 0) {
//           res.json({
//             data: req.params,
//             msg: "Invalid question id!",
//             status: 200,
//           });
//         } else {
//           res.json({
//             data: data,
//             msg: "All orders deleted Successfully!",
//             status: 200,
//           });
//         }
//       }
//     })
//     .clone();
// });

router.delete("/deleteuserdetailsbyuserid/:userId", async (req, res) => {
  await userDetailsDB
    .deleteOne({ "user.uid": req.params.userId }, (err, data) => {
      if (err) {
        res.json({ data: err, msg: "SMW", status: -1 });
      } else {
        if (data.deletedCount == 0) {
          res.json({
            data: req.params,
            msg: "Invalid user id!",
            status: 200,
          });
        } else {
          res.json({
            data: data,
            msg: "User Deleted Successfully!",
            status: 200,
          });
        }
      }
    })
    .clone();
});

router.delete("/deletespacesbyuserid/:userId", async (req, res) => {
  await spaceDB
    .deleteMany({ "user.uid": req.params.userId }, (err, data) => {
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
    })
    .clone();
});

router.delete("/deleteorderdetailsbyuserid/:userId", async (req, res) => {
  await orderDetailsDB
    .deleteMany({ "user.uid": req.params.userId }, (err, data) => {
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
            msg: "All orders deleted Successfully!",
            status: 200,
          });
        }
      }
    })
    .clone();
});

router.delete("/deleteanswersbyuserid/:userId", async (req, res) => {
  await answerDB
    .deleteMany({ "user.uid": req.params.userId }, (err, data) => {
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
            msg: "All answers of deleted user deleted Successfully!",
            status: 200,
          });
        }
      }
    })
    .clone();
});

router.delete("/deletequestionsbyuserid/:userId", async (req, res) => {
  await questionDB
    .deleteMany({ "user.uid": req.params.userId }, (err, data) => {
      if (err) {
        res.json({ data: err, msg: "SMW", status: -1 });
      } else {
        if (data.deletedCount == 0) {
          res.json({
            data: req.params,
            msg: "Invalid user id!",
            status: 200,
          });
        } else {
          res.json({
            data: data,
            msg: "Questions of deleted user deleted Successfully!",
            status: 200,
          });
        }
      }
    })
    .clone();
});

module.exports = router;
