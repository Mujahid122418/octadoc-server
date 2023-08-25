const express = require("express");
const {
  addCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../controller/category");

const router = express.Router();

// const { protect } = require('../middleware/auth');

router.post("/category", addCategory);
router.get("/category", getCategory);
router.delete("/category/:id", deleteCategory);
router.put("/category/:id", updateCategory);

module.exports = router;
