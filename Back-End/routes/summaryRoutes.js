//summaryRoutes.js
import express from "express";
import { processVideo, getSummaries } from "../controllers/summaryController.js";
import summaryModel from "../models/summaryModel.js";
import { authMiddleware } from "../middleware/auth.js";
import { getSummaryById } from "../controllers/summaryController.js";

const router = express.Router();

router.post("/process", authMiddleware, processVideo);
router.get("/summaries", authMiddleware, getSummaries);
router.get("/summary/:videoId", authMiddleware, getSummaryById);
export default router;
