const express = require("express");
const {
  addAnswer,
  getAnswer,
  deleteAnswer,
  updateAnswer,
} = require("../controller/answer");

const router = express.Router();

// const { protect } = require('../middleware/auth');

router.post("/answer", addAnswer);
router.get("/answer", getAnswer);
router.delete("/answer/:id", deleteAnswer);
router.put("/answer/:id", updateAnswer);

module.exports = router;
