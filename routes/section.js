const express = require("express");
const {
  addSection,
  getSection,
  deleteSection,
  updateSection,
} = require("../controller/section");

const router = express.Router();

// const { protect } = require('../middleware/auth');

router.post("/section", addSection);
router.get("/section", getSection);
router.delete("/section/:id", deleteSection);
router.put("/section/:id", updateSection);

module.exports = router;
