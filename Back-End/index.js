// index.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import userModel from "./models/userModel.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import youtubeRoutes from "./routes/youtube.js";
import authRoutes from "./routes/authRoutes.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();

app.use(cors({ origin: "https://clipnote-rho.vercel.app", credentials: true }));
app.use(express.json());

// ✅ Google Auth Client (for verifying tokens from frontend)
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ============= GOOGLE ONE-TAP LOGIN =============
app.post("/auth/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Try to find user by googleId OR email
    let user = await userModel.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email }],
    });

    if (!user) {
      const defaultUsername = payload.name
        ? payload.name.replace(/\s+/g, "").toLowerCase() + Date.now()
        : "user" + Date.now();

      user = await userModel.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        username: defaultUsername,
        provider: "google",
        verified: true, // <-- Google accounts are auto-verified
      });
    } else {
      // If user exists but not linked with Google, update it
      if (!user.googleId) {
        user.googleId = payload.sub;
        user.provider = "google";
      }
      user.avatar = payload.picture;
      user.verified = true; // ensure marked verified
      await user.save();
    }

    // Create app JWT
    const appToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token: appToken,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ error: "Invalid Google token" });
  }
});


// ============= OTHER ROUTES =============
// Add authMiddleware to routes that require userId
app.use("/auth", authRoutes); // login/signup routes
app.use("/youtube", youtubeRoutes); // public route
app.use("/", authMiddleware, summaryRoutes); // ✅ protect summary routes

// ✅ MongoDB connect
console.log("JWT_SECRET:", process.env.JWT_SECRET);
mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

export default app;
