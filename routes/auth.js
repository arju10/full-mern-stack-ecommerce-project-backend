const express = require("express");
const { registerUser, loginUser, logout, getUserProfile} = require("../controllers/authController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.route('/register').post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser,getUserProfile);
module.exports = router;
