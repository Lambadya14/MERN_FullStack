import express from "express";
import {
  createUser,
  getUser,
  loginUser,
  sendOtpForPasswordChange,
  updateUsername,
  updateUserPassword,
  //   deleteProduct,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUser);
router.post("/signin", createUser);
router.post("/login", loginUser);
router.put("/edit/username/:id", updateUsername);
router.put("/edit/password/:id", updateUserPassword);
router.put("/verifyotp/:id", sendOtpForPasswordChange);
// router.delete("/:id", deleteProduct);

export default router;
