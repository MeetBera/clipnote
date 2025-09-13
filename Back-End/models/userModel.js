//userModel.js
import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, sparse: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String }, // only for local users
  googleId: { type: String, unique: true, sparse: true }, // for Google users
  name: { type: String },
  avatar: { type: String },
  provider: { type: String, enum: ["local", "google"], default: "local" },

  // email verification (local only)
  verified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date }

});

export default mongoose.model("User", userSchema);