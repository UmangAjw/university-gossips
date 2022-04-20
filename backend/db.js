const mongoose = require("mongoose");
const url =
  "mongodb+srv://umang:zigupmedia@cluster0.cf3zh.mongodb.net/university-gossips";

module.exports.connect = () => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 100,
    })
    .then(() => {
      console.log("Mongo DB connected");
    })
    .catch((e) => console.log("Error", e));
};
