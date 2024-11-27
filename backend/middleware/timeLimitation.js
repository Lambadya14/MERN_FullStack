import rateLimit from "express-rate-limit";

const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 3, // Maksimal 3 permintaan per IP
  message: {
    success: false,
    message: "Too many request. Please try again after 15 minutes!.",
  },
});

export default otpRequestLimiter;
