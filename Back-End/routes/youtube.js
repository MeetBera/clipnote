// routes/youtube.js
import express from "express";
import fetch from "node-fetch";
const router = express.Router();

router.get("/video/:id", async (req, res) => {
  const videoId = req.params.id;
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );

    const data = await ytRes.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: "Video not found" });
    }

    const snippet = data.items[0].snippet;

    res.json({
      title: snippet.title,
      thumbnail: snippet.thumbnails?.high?.url || "",
    });
  } catch (err) {
    console.error("YouTube API error:", err);
    res.status(500).json({ error: "Failed to fetch video details" });
  }
});

export default router;
