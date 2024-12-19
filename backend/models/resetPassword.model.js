import mongoose from "mongoose";

const ResetOTPSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Email pengguna terkait
  token: { type: String, required: true }, // Token reset password
  createdAt: { type: Date, default: Date.now, expires: 300 }, // OTP expires in 5 minutes
});

const resetOTP = mongoose.model("resetOTP", ResetOTPSchema);
export default resetOTP;
