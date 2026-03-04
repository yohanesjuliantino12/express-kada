import express from "express";
import { createTransaction } from "../utils/midtrans.js";

const router = express.Router();

router.post("/create", createTransaction);

export default router;