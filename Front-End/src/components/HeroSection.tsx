// // HeroSection.tsx
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Play, ArrowRight, Link, Zap, Target, FileText } from "lucide-react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { LoginPrompt } from "@/components/LoginPrompt";
// import { useAuth } from "@/context/AuthContext";

// const features = [
//   { icon: <Zap className="w-6 h-6 md:w-7 md:h-7 text-primary" />, title: "Lightning Fast", text: "Summaries in seconds" },
//   { icon: <Target className="w-6 h-6 md:w-7 md:h-7 text-primary" />, title: "Highly Accurate", text: "AI-powered insights" },
//   { icon: <FileText className="w-6 h-6 md:w-7 md:h-7 text-primary" />, title: "Multiple Formats", text: "Text, bullets, or highlights" },
// ];

// export const HeroSection = () => {
//   const navigate = useNavigate();
//   const [videoUrl, setVideoUrl] = useState("");
//   const [loginPromptOpen, setLoginPromptOpen] = useState(false);
//   const { user } = useAuth();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!videoUrl.trim()) return;

//     if (!user) {
//       setLoginPromptOpen(true);
//       return;
//     }

//     navigate(`/summary?url=${encodeURIComponent(videoUrl.trim())}`);
//   };

//   return (
//     <section
//       id="home"
//       className="min-h-screen bg-gradient-hero flex items-center justify-center pt-16 md:pt-20"
//     >
//       <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
//         <div className="max-w-5xl mx-auto text-center">
//           {/* Title */}
//           <motion.h1
//             initial={{ opacity: 0, y: -40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-foreground mb-4 md:mb-6 leading-tight"
//           >
//             AI{" "}
//             <span className="bg-gradient-primary bg-clip-text text-transparent">
//               Summarizer
//             </span>
//           </motion.h1>

//           {/* Tagline */}
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.8 }}
//             className="text-base sm:text-lg md:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
//           >
//             Save time. Stay informed. Let AI transform long videos into clear,
//             concise summaries in seconds.
//           </motion.p>

//           {/* Input Form */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4, duration: 0.8 }}
//             className="max-w-2xl mx-auto mb-12 md:mb-16 w-full"
//           >
//             <form
//               onSubmit={handleSubmit}
//               className="flex flex-col sm:flex-row gap-3 md:gap-4"
//             >
//               <div className="relative flex-1">
//                 <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
//                 <Input
//                   type="url"
//                   placeholder="Paste your video link here..."
//                   value={videoUrl}
//                   onChange={(e) => setVideoUrl(e.target.value)}
//                   className="pl-10 h-12 md:h-14 text-base md:text-lg bg-card/70 border border-border backdrop-blur-md focus:ring-primary focus:border-primary rounded-xl transition-all w-full"
//                 />
//               </div>
//               <Button
//                 type="submit"
//                 size="lg"
//                 className="h-12 md:h-14 px-6 md:px-8 font-medium bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 transition-all rounded-xl w-full sm:w-auto"
//               >
//                 <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />
//                 <span className="whitespace-nowrap">Quick Summary</span>
//                 <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
//               </Button>
//             </form>
//             <p className="text-xs md:text-sm text-muted-foreground mt-3">
//               Supports YouTube (more platforms coming soon)
//             </p>
//           </motion.div>

//           {/* Features */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6, duration: 0.8 }}
//             className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-8 max-w-4xl mx-auto"
//           >
//             {features.map((feature, i) => (
//               <motion.div
//                 key={i}
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-card/70 backdrop-blur-md rounded-2xl shadow-lg p-5 md:p-6 text-center border border-border hover:shadow-xl transition-all"
//               >
//                 <div className="bg-primary/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
//                   {feature.icon}
//                 </div>
//                 <h3 className="font-semibold text-base md:text-lg text-foreground mb-1 md:mb-2">
//                   {feature.title}
//                 </h3>
//                 <p className="text-muted-foreground text-xs md:text-sm">{feature.text}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </div>

//       {/* Login Prompt */}
//       <LoginPrompt open={loginPromptOpen} onOpenChange={setLoginPromptOpen} />
//     </section>
//   );
// };
// HeroSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, ArrowRight, Link } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Target, FileText } from "lucide-react";
import { LoginPrompt } from "@/components/LoginPrompt";
import { useAuth } from "@/context/AuthContext"; // ✅ import context

const features = [
  { icon: <Zap className="w-7 h-7 text-primary" />, title: "Lightning Fast", text: "Summaries in seconds" },
  { icon: <Target className="w-7 h-7 text-primary" />, title: "Highly Accurate", text: "AI-powered insights" },
  { icon: <FileText className="w-7 h-7 text-primary" />, title: "Multiple Formats", text: "Text, bullets, or highlights" },
];

export const HeroSection = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const { user } = useAuth(); // ✅ use context

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    if (!user) {
      setLoginPromptOpen(true); // Show popup if not logged in
      return;
    }

    navigate(`/summary?url=${encodeURIComponent(videoUrl.trim())}`);
  };

  return (
    <section
      id="home"
      className="min-h-screen bg-gradient-hero flex items-center justify-center pt-20"
    >
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 leading-tight"
          >
            AI{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Summarizer
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Save time. Stay informed. Let AI transform long videos into clear,
            concise summaries in seconds.
          </motion.p>

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="url"
                  placeholder="Paste your video link here..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="pl-10 h-14 text-lg bg-card/70 border border-border backdrop-blur-md focus:ring-primary focus:border-primary rounded-xl transition-all"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 font-medium bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 transition-all rounded-xl"
              >
                <Play className="mr-2 h-5 w-5" />
                Quick Summary
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-3">
              Supports YouTube (more platforms coming soon)
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-card/70 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center border border-border hover:shadow-xl transition-all"
              >
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Login Prompt */}
      <LoginPrompt open={loginPromptOpen} onOpenChange={setLoginPromptOpen} />
    </section>
  );
};
