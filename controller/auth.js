const crypto = require("crypto");
const asyncHandler = require("../middleware/async");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/user");

exports.register = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      gender,
      state,
      language,
      countryofTraining,
      workingHours,
      yearsofPractice,
      phone,
    } = req.body;

    //  Create user
    let isAlready = await User.findOne({ email: email });

    if (isAlready) {
      return res.status(500).send({
        success: false,
        message: `${email} Email is Already exist`,
        // message: error,
      });
    } else {
      const user = await User.create({
        name,
        email,
        password,
        role,
        gender,
        state,
        language,
        countryofTraining,
        workingHours,
        yearsofPractice,
        phone,
      });
      sendTokenResponse(user, 200, res);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong or Not authorized to access this route",
      // message: error,
    });
  }
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    res
      .status(401)
      .send({ success: false, message: "Not authorized to access this route" });
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401).send({ success: false, message: "Invalid credentials" });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401).send({ success: false, message: "Invalid credentials" });
  }
  res.status(200).send({ success: true, data: user });

  // sendTokenResponse(user, 200, res);
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const { id } = req?.body;
  const user = await User.findById(id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public

const getRandomNumber = () => {
  let min = 1000;
  let max = 9999;
  return Math.round(Math.random() * (max - min) + min);
};

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res
      .status(404)
      .send({ success: false, message: "There is no user with that email" });
  }
  console.log("user  ", user);
  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    let randomNumber = getRandomNumber();
    await User.findByIdAndUpdate(user.id, {
      otp: randomNumber,
    });
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
      otp: randomNumber,
    });

    res.status(200).json({ success: true, data: "Email sent", user: user });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    res
      .status(500)
      .send({ success: false, message: "Email could not be sent" });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ otp: req.body.otp, _id: req.body.user_id });
  if (!user) {
    return res.status(200).send({
      message: "OTP is incorrect",
      success: false,
    });
  }

  return res.status(200).send({
    message: "OTP is matched",
    user: user,
    success: true,
  });

  // Get hashed token
  // const resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(req.params.resettoken)
  //   .digest("hex");

  // const user = await User.findOne({
  //   resetPasswordToken,
  //   resetPasswordExpire: { $gt: Date.now() },
  // });

  // if (!user) {
  //   res.status(400).send({ success: false, message: "Invalid token" });
  // }

  // // Set new password
  // user.password = req.body.password;
  // user.resetPasswordToken = undefined;
  // user.resetPasswordExpire = undefined;
  // await user.save();

  // sendTokenResponse(user, 200, res);
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const {
    id,
    name,
    email,
    gender,
    state,
    language,
    countryofTraining,
    yearsofPractice,
    workingHours,
    role,
    status,
  } = req.body;
  const fieldsToUpdate = {
    name: name,
    email: email,
    gender: gender,
    state: state,
    language: language,
    countryofTraining: countryofTraining,
    workingHours: workingHours,
    yearsofPractice: yearsofPractice,
    role: role,
    status: status,
  };
  console.log("fieldsToUpdate", id, fieldsToUpdate);
  const user = await User.findByIdAndUpdate(id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
const hashPasswordReset = async (id, password) => {
  const user = await User.findByIdAndUpdate(
    id,
    { password: password },
    {
      new: true,
      runValidators: true,
    }
  );
  if (user) {
    return true;
  } else {
    return false;
  }
};

exports.updatePassword = async (req, res, next) => {
  // const user1 = await User.findById({ _id: id });

  await bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        error: err,
      });
    } else {
      if (hashPasswordReset(req.body.user_id, hash)) {
        return res.status(200).send({
          message: "Password is updated",
          success: true,
        });
      } else {
        return res.status(200).send({
          message: "Something went wrong!",
          success: false,
        });
      }
    }
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
// module.exports = router;

exports.AllUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Get the page size or default to 10

  try {
    const totalDocuments = await User.countDocuments(); // Get the total number of documents

    const totalPages = Math.ceil(totalDocuments / pageSize); // Calculate the total number of pages

    const skip = (page - 1) * pageSize; // Calculate the number of documents to skip

    // Query and retrieve paginated data
    const data = await User.find().skip(skip).limit(pageSize);

    res.json({
      data,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
