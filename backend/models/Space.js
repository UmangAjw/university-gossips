const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema(
  {
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
    followersWithTime: Object,
    moderators: [String],
  },
  { minimize: false }
);

module.exports = mongoose.model("Spaces", SpaceSchema);
