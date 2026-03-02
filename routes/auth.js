import express from "express";
import bcrypt from "bcrypt";
import { User } from '../models/schemas/index.js';
import jwt from "jsonwebtoken";

const router = express.Router();

// ⚠️ sementara hardcode dulu
const JWT_SECRET = "supersecretkey";

/* ================= REGISTER ================= */
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Cek user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        result: "fail",
        message: "Email sudah terdaftar",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    await User.create({
      email,
      password: hashedPassword,
    });

    res.json({
      result: "success",
      message: "Register berhasil",
    });

  } catch (err) {
    next(err);
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        result: "fail",
        message: "User tidak ditemukan",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        result: "fail",
        message: "Password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      result: "success",
      token,
    });

  } catch (err) {
    next(err);
  }
});

export default router;