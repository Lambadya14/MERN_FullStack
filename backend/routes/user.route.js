import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUserProfile,
  loginUser,
  requestOTP,
  requestResetOTP,
  updateUserImage,
  updateUsername,
  updateUserPassword,
  verifyOTP,
  verifyResetOTP,
  //   deleteProduct,
} from "../controllers/user.controller.js";
import timeLimitation from "../middleware/timeLimitation.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/", getUser);
router.get("/me", authenticateToken, getUserProfile);
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/edit/username/:id", updateUsername);
router.put("/edit/password/:id", updateUserPassword);
router.put("/edit/image/:id", updateUserImage);
// router.post("/request-otp/:id", timeLimitation, requestOTP);
// router.post("/verify-otp/:id", timeLimitation, verifyOTP);
router.post("/request-otp/:id", requestOTP);
router.post("/verify-otp/:id", verifyOTP);
router.delete("/:id", deleteUser);
router.post("/request-reset-password", requestResetOTP);
router.post("/verify-reset-password", verifyResetOTP);
// router.post('/reset-password', resetPassword);

export default router;
