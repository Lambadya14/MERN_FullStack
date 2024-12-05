import mongoose from "mongoose";
import User from "../models/user.models.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Otp from "../models/otp.model.js";

export const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: "true", data: users });
  } catch (error) {
    console.error("Error in fetching Users:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserProfile = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Ambil token dari header
  console.log("Received token:", token);

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userId);

    console.log("User found:", user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...userData } = user.toObject();
    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  // Validasi Input
  if (!name || !email || !password || !confPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  if (password !== confPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  try {
    // Periksa apakah email sudah digunakan
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered" });
    }
    const hashedPassword = await argon2.hash(password);

    // Buat user baru dengan password yang telah di-hash
    const newUser = new User({ name, email, password: hashedPassword, role });

    // Simpan user ke database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error in createUser:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    // Cari pengguna berdasarkan email
    const user = await User.findOne({ email });

    // Jika pengguna tidak ditemukan
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verifikasi password menggunakan Argon2
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key dari .env file
      { expiresIn: "1h" } // Token valid selama 1 jam
    );

    // Kirimkan token dan data pengguna
    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Kirim token
      data: {
        userId: user._id,
        email: user.email,
        name: user.name, // atau atribut lain yang diperlukan
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateUsername = async (req, res) => {
  const { id } = req.params;
  const user = req.body;

  // Ambil token dari header (Jika sudah menggunakan middleware, ini bisa dihapus)
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "No token provided" });
  }

  // Validasi apakah id pengguna valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid User Id!" });
  }

  try {
    // Cari dan update data pengguna
    const updateUser = await User.findByIdAndUpdate(
      id,
      { name: user.name },
      { new: true } // Mengembalikan data yang telah diperbarui
    );

    // Jika pengguna tidak ditemukan setelah update
    if (!updateUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: updateUser,
      message: "Update successful",
    });
  } catch (error) {
    console.error("Error in updateUser:", error.message); // Perbaiki log kesalahan
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateUserPassword = async (req, res) => {
  const { password } = req.body; // Ambil password dari body request

  const token = req.headers["authorization"]?.split(" ")[1]; // Ambil token dari header

  // Validasi input token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  const userId = decoded.userId;

  // Validasi apakah userId adalah ObjectId yang valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid User ID!",
    });
  }

  // Validasi input password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])?.{8,}$/;

  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and an optional special character!",
    });
  }

  try {
    // Hash password menggunakan Argon2
    const hashedPassword = await argon2.hash(password);

    // Update password pengguna
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updateUser,
      message: "Password updated successfully",
    });

    // Hapus OTP terkait jika ada
    const otpRecord = await Otp.findOne({ userId });
    if (otpRecord) {
      await Otp.deleteOne({ _id: otpRecord._id });
    }
  } catch (error) {
    console.error("Error in updateUserPassword:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Fungsi untuk mengirim OTP melalui email
const sendOtpEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD, // Gantilah dengan password email Anda atau gunakan OAuth
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Here is your OTP!",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send OTP email");
  }
};

// Fungsi untuk menghasilkan OTP
const generateOtp = () => {
  return Array.from({ length: 6 }, () => crypto.randomInt(0, 10)).join("");
};

// Fungsi untuk mengirim OTP dan menyimpannya di database
export const requestOTP = async (req, res) => {
  const { email, userId } = req.body;

  if (!email || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    // Cek apakah user ada dan email sesuai
    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or user ID" });
    }

    // Hapus OTP lama jika ada
    await Otp.deleteMany({ userId });

    // Generate OTP baru
    const otp = generateOtp(); // Pastikan generateOtp() menghasilkan OTP acak
    const hashedOtp = await argon2.hash(otp); // Hash OTP menggunakan Argon2
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    // Simpan hash OTP ke database
    await Otp.create({
      userId,
      otp: hashedOtp,
      expiresAt: expiresAt,
    });

    // Kirim OTP ke email pengguna
    await sendOtpEmail(email, otp);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in requestOTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};
export const verifyOTP = async (req, res) => {
  const { otp, userId } = req.body;

  if (!otp) {
    return res.status(400).json({ success: false, message: "Missing OTP " });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid User ID!" });
  }

  try {
    // Cari OTP di database
    const otpRecord = await Otp.findOne({ userId });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid OTP!" });
    }

    // Cek apakah OTP sudah kedaluwarsa
    if (otpRecord.expiresAt < Date.now()) {
      await Otp.deleteOne({ _id: otpRecord._id }); // Hapus OTP yang kedaluwarsa
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired!" });
    }

    // Verifikasi OTP yang dimasukkan pengguna dengan hash OTP yang disimpan
    const isValid = await argon2.verify(otpRecord.otp, otp);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP!" });
    }

    // Hapus OTP setelah berhasil diverifikasi (opsional untuk OTP sekali pakai)
    await Otp.deleteOne({ _id: otpRecord._id });

    const generateToken = (userId) => {
      // Buat token JWT yang berisi userId dan masa berlaku token (misalnya 1 jam)
      const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return token;
    };
    // OTP valid, buat token atau sesi
    const token = generateToken(userId); // Buat token/sesi (gunakan JWT atau sesi)
    res
      .status(200)
      .json({ success: true, message: "OTP verified", token: token });
  } catch (error) {
    console.error("Error in verifyOTP:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User Id" });
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User has been deleted" });
  } catch (error) {
    console.error("Error in deleting products:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
