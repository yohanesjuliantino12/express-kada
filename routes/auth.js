import express from "express";
import bcrypt from "bcrypt";
import { User } from '../models/schemas/index.js';


const router = express.Router();

// REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Cek email sudah ada atau belum
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        result: "fail",
        message: "Email sudah terdaftar",
      });
    }

    // 2️⃣ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 3️⃣ Simpan user
    await User.create({
      email,
      password: hashed,
    });

    res.json({ result: "success" });
  } catch (err) {
    next(err);
  }
});

// LOGIN
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

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        result: "fail",
        message: "Password salah",
      });
    }

    res.json({ result: "success" });
  } catch (err) {
    next(err);
  }
});

export default router;