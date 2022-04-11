const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema({
  spaceName: {
    type: String,
    required: true,
  },
  spaceDesc: String,
  spaceProfilePic: String,
  createdAt: Number,
  user: Object,
  slug: {
    type: String,
    unique: true,
  },
  followers: [String],
  moderators: [String],
});

module.exports = mongoose.model("Spaces", SpaceSchema);
