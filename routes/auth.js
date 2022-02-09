const express = require("express");
const { registerUser, loginUser, logout, getUserProfile, updatePassword, updateProfile, allUsers, getUserDetails, } = require("../controllers/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route('/register').post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser,getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails);


module.exports = router;
