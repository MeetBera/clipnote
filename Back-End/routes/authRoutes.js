//authRoutes.js

import express from "express";
import { signup, login, verifyOtp, resendOtp  } from "../controllers/authController.js";

const router = express.Router();

console.log("✅ Auth routes initialized");

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOtp); 
router.post("/resend-otp", resendOtp);

export default router;