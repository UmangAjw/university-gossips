const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.Mixed,
  xp: Number,
  username: {
    type: String,
    unique: true,
  },
  createdAt: Number,
  name: String,
  profilePic: String,
  userBio: String,
  // followingSpaces: [String],
});

module.exports = mongoose.model("UserDetails", UserDetailSchema);
