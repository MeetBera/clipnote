import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
  videoId: { type: String, required: true},
  title: String,
  thumbnail: String,
  summary: String,
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

summarySchema.index({ videoId: 1, userId: 1 }, { unique: true });

export default mongoose.model("summaryModel", summarySchema);
