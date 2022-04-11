const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    answer: String,
    voters: { type: Object },
    voteCounter: Number,
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questions",
    },
    createdAt: Number,
    user: Object,
  },
  { minimize: false }
);

module.exports = mongoose.model("Answers", AnswerSchema);
