import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  loginUser,
  sendOtpForPasswordChange,
  updateUsername,
  updateUserPassword,
  //   deleteProduct,
} from "../controllers/user.controller.js";
import timeLimitation from "../middleware/timeLimitation.js";

const router = express.Router();

router.get("/", getUser);
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/edit/username/:id", updateUsername);
router.put("/edit/password/:id", updateUserPassword);
router.put("/verifyotp/:id", timeLimitation, sendOtpForPasswordChange);
router.delete("/:id", deleteUser);

export default router;
