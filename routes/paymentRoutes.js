import express from "express";
import { createTransaction, handleNotification, checkStatus } from "../utils/midtrans.js";

const router = express.Router();

router.post("/create", createTransaction);
router.post("/notification", handleNotification, checkStatus)

export default router;