const express = require("express");
const {
  addQuestion,
  getQuestion,
  deleteQuestion,
  updateQuestion,
  singleQuestion,
} = require("../controller/templateQuestion");
// const TemplateQuestions = require("../models/templateQuestions");
const router = express.Router();

// const { protect } = require('../middleware/auth');

router.post("/question", addQuestion);
router.get("/question", getQuestion);
router.delete("/question/:id", deleteQuestion);
router.put("/question/:id", updateQuestion);
router.get("/singleQueston/:id", singleQuestion);
module.exports = router;
