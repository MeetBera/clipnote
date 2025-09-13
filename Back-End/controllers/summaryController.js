// controllers/summaryController.js
// import fetch from "node-fetch";
import { exec } from "child_process";
import summaryModel from "../models/summaryModel.js";

const pythonPath = "C:/Users/Lenovo/OneDrive/Desktop/PROGRAMMING/python/Summary/venv/Scripts/python.exe";
const scriptPath = "C:/Users/Lenovo/OneDrive/Desktop/PROGRAMMING/python/Summary/Summary.py";

// process a new video
export const processVideo = async (req, res) => {
  const { url, title, thumbnail } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: missing userId" });
  }

  try {
    const videoId = new URL(url).searchParams.get("v");

    // 1️⃣ Check if summary already exists for this user + video
    let existing = await summaryModel.findOne({ videoId, userId });
    if (existing) {
      return res.json({ result: existing.summary });
    }

    // 2️⃣ If not, run Python
    exec(`"${pythonPath}" "${scriptPath}" "${url}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error("Exec error:", error);
        return res.status(500).json({ error: error.message });
      }

      try {
        const parsed = JSON.parse(stdout);

        let cleanResult = parsed.result
          .replace(/\\u0027/g, "'")
          .replace(/\*\*/g, "")
          .replace(/\\n/g, "\n");

        const doc = await summaryModel.findOneAndUpdate(
          { videoId, userId },
          {
            userId,
            videoId,
            title: title || parsed.title || "Untitled",
            thumbnail: thumbnail || parsed.thumbnail || "",
            summary: cleanResult,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({ result: doc.summary });
      } catch (e) {
        console.error("JSON parse error:", e, "Raw output:", stdout);
        res.status(500).json({ error: "Invalid JSON from Python" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ Fetch all summaries for logged-in user
export const getSummaries = async (req, res) => {
  try {
    const userId = req.user?.userId; // matches your JWT payload
    const docs = await summaryModel.find({ userId }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Fetch a single summary by videoId
export const getSummaryById = async (req, res) => {
  try {
    const userId = req.user?.userId; // matches your JWT payload
    const { videoId } = req.params;

    const doc = await summaryModel.findOne({ videoId, userId });
    if (!doc) {
      return res.status(404).json({ error: "Summary not found" });
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};