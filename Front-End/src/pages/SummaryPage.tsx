// SummaryPage.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ClipboardCopy, Share2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const extractVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtu.be")) return urlObj.pathname.slice(1);
    if (urlObj.hostname.includes("youtube.com")) return urlObj.searchParams.get("v");
  } catch {
    return null;
  }
  return null;
};

interface VideoSummary {
  videoId: string;
  title: string;
  thumbnail: string;
  summary: string;
}

export default function SummaryPage() {
  const { apiFetch } = useApi();
  const { token, isLoading } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const videoUrl = searchParams.get("url") || "";

  const [videoData, setVideoData] = useState<VideoSummary | null>(null);
  const [previousSummaries, setPreviousSummaries] = useState<VideoSummary[]>([]);
  const [loading, setLoading] = useState(false);

  // Load previous summaries once token is available
  useEffect(() => {
    if (isLoading || !token) return; // wait for token

    const loadSummaries = async () => {
      try {
        const data = await apiFetch("/summaries");
        setPreviousSummaries(data);
      } catch (err: any) {
        console.error("Failed to load summaries:", err);
        if (err.message.includes("401")) {
          alert("Unauthorized! Please login again.");
        }
      }
    };

    loadSummaries();
  }, [apiFetch, token, isLoading]);

  const fetchVideoDetails = async (videoId: string) => {
    if (!token) return;
    setLoading(true);

    try {
      // Check DB first
      try {
        const existingData = await apiFetch(`/summary/${videoId}`);
        if (existingData?.summary) {
          setVideoData(existingData);
          setPreviousSummaries((prev) =>
            prev.some((v) => v.videoId === videoId) ? prev : [existingData, ...prev]
          );
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("No summary in DB:", err);
      }

      // Fetch YouTube metadata
      const ytRes = await apiFetch(`/youtube/video/${videoId}`);
      if (!ytRes?.title) {
        alert("Video not found. Please check the URL.");
        setLoading(false);
        return;
      }

      const newVideo: VideoSummary = {
        videoId,
        title: ytRes.title,
        thumbnail: ytRes.thumbnail || "",
        summary: "Loading summary...",
      };
      setVideoData(newVideo);

      // Process video on backend
      const backendData = await apiFetch("/process", {
        method: "POST",
        body: JSON.stringify({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          title: ytRes.title,
          thumbnail: ytRes.thumbnail,
        }),
      });

      setVideoData((prev) =>
        prev ? { ...prev, summary: backendData.result } : prev
      );

      setPreviousSummaries((prev) =>
        prev.some((v) => v.videoId === videoId)
          ? prev
          : [{ ...newVideo, summary: backendData.result }, ...prev]
      );
    } catch (error: any) {
      console.error("Error fetching video/summary:", error);
      alert(error.message.includes("401") ? "Unauthorized! Please login again." : "Error while fetching video/summary.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch video when URL or token changes
  useEffect(() => {
    if (isLoading || !token || !videoUrl) return;

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      alert("Invalid YouTube URL in query parameter.");
      return;
    }

    fetchVideoDetails(videoId);
  }, [videoUrl, token, isLoading]);

  const selectVideo = (videoId: string) => {
    const found = previousSummaries.find((v) => v.videoId === videoId);
    if (found) setVideoData(found);
  };

  const copyToClipboard = () => {
    if (videoData?.summary) {
      navigator.clipboard.writeText(videoData.summary);
      alert("Summary copied to clipboard!");
    }
  };

  const shareLink = () => {
    if (navigator.share && videoData) {
      navigator.share({
        title: videoData.title,
        text: videoData.summary,
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  // Show loading while auth state initializes
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen text-muted-foreground">
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen mt-20 bg-background text-foreground">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card p-4 overflow-y-auto flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Previous Summaries</h2>
          <ul className="space-y-3 flex-1 overflow-y-auto">
            {!token ? (
              <li className="text-muted-foreground">Please login to see summaries</li>
            ) : previousSummaries.length === 0 ? (
              <li className="text-muted-foreground">No previous summaries yet</li>
            ) : (
              previousSummaries.map((item) => (
                <li
                  key={item.videoId}
                  className={`cursor-pointer p-3 rounded-lg transition-colors ${
                    videoData?.videoId === item.videoId
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => selectVideo(item.videoId)}
                >
                  <p className="font-medium truncate">{item.title}</p>
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {!token ? (
            <div className="text-center text-muted-foreground mt-20">
              Please login to access your summaries.
            </div>
          ) : !videoData ? (
            <div className="text-center text-muted-foreground mt-20">
              {loading ? "Loading..." : "No video URL found. Please provide a YouTube URL in the query parameter."}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <Video className="text-primary" />
                <h1 className="text-2xl font-bold">{videoData.title}</h1>
              </div>

              {videoData.thumbnail ? (
                <img
                  src={videoData.thumbnail}
                  alt={videoData.title}
                  className="rounded-xl w-full object-cover max-h-96 shadow-md border border-border"
                />
              ) : (
                <div className="rounded-xl w-full object-cover max-h-96 shadow-md border border-border flex items-center justify-center bg-muted text-muted-foreground">
                  No thumbnail available
                </div>
              )}

              <div className="bg-card border border-border rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Summary</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <ClipboardCopy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={shareLink}>
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {videoData.summary}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
