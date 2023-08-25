const express = require("express");
const {
  addTemplate,
  getTemplate,
  deleteTemplate,
  updateTemplate,
} = require("../controller/template");

const router = express.Router();

router.post("/template", addTemplate);
router.get("/template", getTemplate);
router.delete("/template/:id", deleteTemplate);
router.put("/template/:id", updateTemplate);

module.exports = router;
