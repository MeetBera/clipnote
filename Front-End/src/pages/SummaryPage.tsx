// SummaryPage.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ClipboardCopy, Share2, Video, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  // Mobile Sidebar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load previous summaries once token is available
  useEffect(() => {
    if (isLoading || !token) return;

    const loadSummaries = async () => {
      try {
        const data = await apiFetch("/api/summary");
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

  // Auto-select latest summary when landing on /summary
  useEffect(() => {
    if (!videoData && previousSummaries.length > 0) {
      setVideoData(previousSummaries[0]); // most recent
    }
  }, [previousSummaries, videoData]);


  const fetchVideoDetails = async (videoId: string) => {
    if (!token) return;
    setLoading(true);

    try {
      // Check DB first
      try {
        const existingData = await apiFetch(`/api/summary/${videoId}`);
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
      const backendData = await apiFetch("/api/summary", {
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
    if (found) {
      setVideoData(found);
      setIsMobileMenuOpen(false); // Close sidebar on mobile when clicked
    }
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

  // Helper component to avoid duplicating list code
  const SidebarList = () => (
    <ul className="space-y-3 flex-1 overflow-y-auto mt-4">
      {!token ? (
        <li className="text-muted-foreground">Please login to see summaries</li>
      ) : previousSummaries.length === 0 ? (
        <li className="text-muted-foreground">No previous summaries yet</li>
      ) : (
        previousSummaries.map((item) => (
          <li
            key={item.videoId}
            className={`cursor-pointer p-3 rounded-lg transition-colors text-sm ${videoData?.videoId === item.videoId
              ? "bg-primary/10 text-primary border border-primary/20"
              : "hover:bg-muted"
              }`}
            onClick={() => selectVideo(item.videoId)}
          >
            <p className="font-medium truncate line-clamp-2">{item.title}</p>
          </li>
        ))
      )}
    </ul>
  );

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
      {/* Container with top margin to account for fixed header */}
      <div className="flex min-h-[calc(100vh-80px)] mt-20 bg-background text-foreground relative">

        {/* --- Desktop Sidebar (Hidden on mobile) --- */}
        <aside className="hidden md:flex w-80 border-r border-border bg-card p-4 overflow-y-auto flex-col ml-4 sticky top-24 h-[calc(100vh-80px)]">
          <h2 className="text-lg font-semibold mb-2 px-2">Previous Summaries</h2>
          <SidebarList />
        </aside>

        {/* --- Mobile Sidebar (Slide-over) --- */}
        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-[80%] max-w-sm bg-card border-r shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col p-4 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Previous Summaries</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <SidebarList />
        </div>

        {/* --- Main Content --- */}
        <main className="flex-1 p-4 md:p-8 w-full">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden mb-6 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-4 h-4 mr-2" />
              History
            </Button>
            {videoData && (
              <span className="text-sm text-muted-foreground truncate flex-1">
                Current: {videoData.title}
              </span>
            )}
          </div>

          {!token ? (
            <div className="text-center text-muted-foreground mt-20">
              Please login to access your summaries.
            </div>
          ) : !videoData ? (
            <div className="text-center text-muted-foreground mt-20">
              {loading ? "Loading..." : "No video URL found. Please provide a YouTube URL in the query parameter."}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">

              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Video className="text-primary w-6 h-6" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold leading-tight">{videoData.title}</h1>
                </div>
              </div>

              {/* Main Content: Flex container for Side-by-Side layout */}
              <div className="flex flex-col gap-6 items-start">

                {/* Left Column: Compact Thumbnail */}
                <div className="w-full md:w-[350px] shrink-0">
                  <div className="rounded-xl overflow-hidden border border-border shadow-md bg-muted sticky top-6">
                    {videoData.thumbnail ? (
                      <img
                        src={videoData.thumbnail}
                        alt={videoData.title}
                        className="w-full aspect-video object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-video flex items-center justify-center bg-muted text-muted-foreground text-sm">
                        No thumbnail
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Summary Content */}
                <div className="flex-1 w-full min-w-0"> {/* min-w-0 fixes text overflow issues in flex children */}
                  <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/50">
                      <h2 className="text-xl font-semibold">Summary</h2>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={copyToClipboard} className="flex-1 sm:flex-none">
                          <ClipboardCopy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={shareLink} className="flex-1 sm:flex-none">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>

                    <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {videoData.summary}
                      </ReactMarkdown>
                    </article>
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
