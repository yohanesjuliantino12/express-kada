import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/schemas/index.js";
import { createTransporter } from "../utils/email.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Cek email sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        result: "fail",
        message: "Email sudah terdaftar",
      });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Simpan user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // 4️⃣ Buat verification token
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const verificationLink = `http://yohaneshtgl.my.id/auth/verify/${verificationToken}`;

    // 5️⃣ Buat transporter SETELAH env siap
    const transporter = createTransporter();

    // 6️⃣ Kirim email
    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verifikasi Akun",
      html: `
        <h3>Verifikasi Email</h3>
        <p>Klik link berikut untuk verifikasi akun:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    });

    res.json({
      result: "success",
      message: "Register berhasil. Cek email untuk verifikasi.",
    });

  } catch (err) {
    next(err);
  }
});

/* ================= VERIFY EMAIL ================= */
router.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET
    );

    await User.findByIdAndUpdate(decoded.id, {
      isVerified: true,
    });

    res.send("Email berhasil diverifikasi");
  } catch (err) {
    res.status(400).send("Link tidak valid atau expired");
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

    if (!user.isVerified) {
      return res.status(403).json({
        result: "fail",
        message: "Email belum diverifikasi",
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
      process.env.JWT_SECRET,
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