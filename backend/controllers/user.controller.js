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

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  // Validasi Input
  if (!name || !email || !password || !confPassword || !role) {
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
  const { id } = req.params;
  const { password, otp } = req.body; // Ambil password dan OTP dari body request

  // Validasi apakah id pengguna valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid User Id!" });
  }

  // Verifikasi OTP
  const otpRecord = await Otp.findOne({ userId: id, otp: otp });

  if (!otpRecord) {
    return res.status(400).json({ success: false, message: "Invalid OTP!" });
  }

  // Cek apakah OTP sudah kedaluwarsa
  if (otpRecord.expiresAt < Date.now()) {
    // Hapus OTP yang kedaluwarsa dari database
    await Otp.deleteOne({ _id: otpRecord._id });
    return res
      .status(400)
      .json({ success: false, message: "OTP has expired!" });
  }

  // Hapus OTP setelah diverifikasi untuk mencegah penggunaan ulang
  await Otp.deleteOne({ _id: otpRecord._id });

  // Validasi input password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])?.{8,}$/;

  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and optional special character!",
    });
  }

  try {
    // Hash password menggunakan Argon2
    const hashedPassword = await argon2.hash(password);

    // Cari dan update data pengguna
    const updateUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
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
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error in updateUserPassword:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
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
    subject: "Your OTP for Password Change",
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
export const sendOtpForPasswordChange = async (req, res) => {
  const { email, userId } = req.body;

  // Cek apakah email valid dan pengguna ada
  const user = await User.findById(userId);
  if (!user || user.email !== email) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP kedaluwarsa setelah 10 menit

  try {
    // Simpan OTP ke database
    await Otp.create({
      userId: userId,
      otp: otp,
      expiresAt: expiresAt,
    });

    // Kirim OTP ke email pengguna
    await sendOtpEmail(email, otp);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};
