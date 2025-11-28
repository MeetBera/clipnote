import fetch from "node-fetch";
import summaryModel from "../models/summaryModel.js";

const FLASK_API_URL = "https://renderingpysum.onrender.com/summarize";

// Extract YouTube Video ID safely
function extractVideoId(url) {
  try {
    const parsed = new URL(url);

    // youtu.be/VIDEOID
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "").trim();
    }

    // youtube.com/watch?v=VIDEOID
    const id = parsed.searchParams.get("v");
    if (id) return id.trim();

    return null;
  } catch {
    return null;
  }
}

export const processVideo = async (req, res) => {
  const { url, title, thumbnail } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: missing userId" });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    // 1. Cache Check
    const existing = await summaryModel.findOne({ videoId, userId });
    if (existing) {
      console.log(`[CACHE] Summary found for ${videoId}`);
      return res.json({ result: existing.summary });
    }

    // 2. Send to Flask API
    console.log(`[REQUEST] Sending video to Flask for summarization: ${url}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 600000); // 10 minutes

    let data;

    try {
      const response = await fetch(FLASK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const rawText = await response.text();
      console.log("🧾 Raw Flask response:", rawText.slice(0, 300));

      // Parse JSON safely
      try {
        data = JSON.parse(rawText);
      } catch {
        return res.status(500).json({
          error: "Invalid JSON returned from Flask",
          raw: rawText,
        });
      }

      if (!response.ok || data.error) {
        return res.status(response.status).json({
          error: data.error || `Flask returned HTTP ${response.status}`,
        });
      }
    } catch (err) {
      console.error("🚫 Error contacting Flask:", err.message);

      if (err.name === "AbortError") {
        return res.status(504).json({
          error: "Flask API timed out (10-minute limit)",
        });
      }

      return res.status(502).json({
        error: "Failed to connect to Flask API",
      });
    }

    // 3. Validate response
    if (!data.summary || typeof data.summary !== "string") {
      return res.status(500).json({
        error: "Flask response missing summary",
      });
    }

    // 4. Clean & save summary
    const cleanSummary = data.summary.replace(/\*\*/g, "").trim();

    const doc = await summaryModel.findOneAndUpdate(
      { videoId, userId },
      {
        userId,
        videoId,
        title: title || data.title || "Untitled",
        thumbnail: thumbnail || "",
        summary: cleanSummary,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`[SUCCESS] Summary saved for ${videoId}`);
    return res.json({ result: doc.summary });
  } catch (err) {
    console.error("❗Unexpected error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch all summaries
export const getSummaries = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const docs = await summaryModel.find({ userId }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch specific summary
export const getSummaryById = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { videoId } = req.params;

    const doc = await summaryModel.findOne({ videoId, userId });
    if (!doc) return res.status(404).json({ error: "Summary not found" });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
