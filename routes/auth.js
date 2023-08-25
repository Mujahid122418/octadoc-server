const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  AllUser,
} = require("../controller/auth");

const router = express.Router();
// const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/forgotPassword", forgotPassword);
router.post("/login", login);
router.put("/updatedetails", updateDetails);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatepassword", updatePassword);
router.post("/getme", getMe);
router.get("/allUser", AllUser);

module.exports = router;
