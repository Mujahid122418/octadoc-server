const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Questions_Schema = new mongoose.Schema({
  question: { type: String },
  answers: { type: String },
  QuestionType: { type: String },
  Qindex: { type: String },
  followUp: [
    {
      question: String,
      answers: String,
      QuestionType: String,
      followUp: [],
      Qindex: String,
    },
  ],
});
const template_Schema = new schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    tip: {
      type: String,
    },
    helptext: {
      type: String,
    },
    question_type: {
      type: String,
    },
    order: {
      type: String,
    },
    is_followup_question: {
      type: String,
    },
    followup_question: {
      type: String,
    },
    template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "template",
    },
    question: {
      type: String,
    },
    answers: {
      type: String,
    },
    index: {
      type: String,
    },
    Question: {
      type: [Questions_Schema],
    },
    // followUp: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "templateQuestion" },
    // ], // Use ObjectId reference
  },
  { timestamps: true }
);

module.exports = mongoose.model("templateQuestion", template_Schema);
