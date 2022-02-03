const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

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
