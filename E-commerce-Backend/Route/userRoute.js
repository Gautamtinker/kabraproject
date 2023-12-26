import express from "express";
import { deleteUSer, generateResetToken, getAllUser, getMyDetails, getUser, loginUser, logout, registerUser, resetPassword, updatePassword, updateProfile, updateRole } from '../Controller/userController.js';
import { isAuthUser,authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout)
router.route("/password/forgot").post(generateResetToken);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthUser, getMyDetails);
router.route("/me/update").put(isAuthUser, updateProfile);
router.route("/password/update").put(isAuthUser, updatePassword)

// admin route

router.route("/admin/users").get(isAuthUser, authorizeRoles("admin"), getAllUser);
router.route("/admin/user/:id")
.get(isAuthUser, authorizeRoles("admin"), getUser)
.put(isAuthUser, authorizeRoles("admin"), updateRole)
.delete(isAuthUser, authorizeRoles("admin"), deleteUSer)

export default router;