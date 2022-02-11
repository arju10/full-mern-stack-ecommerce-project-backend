const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register a user => (/api/v1/register) [method :"POST"]
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "ID",
      url: "URL",
    },
  });

  sendToken(user, 200, res);

  // const token = user.getJwtToken()

  // res.status(201).json({
  //     success: true,
  //     // user
  //     token
  // });
});

// Login a user => (/api/v1/login) [method : "POST"]
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.body);
  const { email, password } = req.body;

  // Checking if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter your email & password", 400));
  }

  // Finding user in database
  const user = await User.findOne({ email }).select("+password");
  // console.log(user);

  // If user isn't existing in the Database
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);

  // const token = user.getJwtToken()

  // res.status(201).json({
  //     success: true,
  //     // user
  //     token
  // });
});

// Logout user => /api/v1/Logout [GET]
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// Get Currently Logged-in user details => /api/v1/me [GET]
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// Update/Change Password => /api/v1/password/update [PUT]
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // Check Previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("old Password is incorrect", 400));
  }
  user.password = req.body.password;
  await user.save();
  sendToken(user, 200, res);
});

// Update user profile => "/api/v1/me/updateProfile" [PUT]
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update avatar TODO

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin routes

// Get All Users => "api/v1/admin/allUsers" ['GET']

exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    success: true,
    user,
  });
});

// Get Single User Details => "api/v1/admin/user/:id" ["GET"]
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User does not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user profile  by admin => "/api/v1/admin/update/:id" ["PUT"]
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete user by admin => "/api/v1/admin/user/:id" ["DELETE"]
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  // Find the user
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User does not found"), 404);
  }

  // Delete Avatar from Cloudinary  [TODO]

  user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted successfully!",
  });
});

// Forget Password  => "/api/v1/password/forgot" ["POST"]
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  // Get Reset Token
  const resetToken = user.getResetPasswordToken();
  console.log(user, resetToken);
  await user.save({ validateBeforeSave: false });
  // Creating Reset password URL
  const restURL = `${req.protocol}://${req.get(
    "host"
  )}/api/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${restURL} \n\nIf you have not requested this email then ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

