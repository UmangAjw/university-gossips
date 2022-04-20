const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionName: String,
  questionUrl: String,
  createdAt: Number,
  questionType: Boolean,

  answers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answers",
  },
  user: mongoose.Schema.Types.Mixed,
  slug: {
    type: String,
    unique: true,
  },
  spaceName: String,
});

module.exports = mongoose.model("Questions", QuestionSchema);
