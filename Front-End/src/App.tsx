import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";  
import { GoogleOAuthProvider } from "@react-oauth/google";  // ✅ Google provider

import SummaryPage from "./pages/SummaryPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/LoginPage";   
import Signup from "./pages/SignupPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <GoogleOAuthProvider clientId="1060607946443-ln19iqle67kim76okohm702njt82i4th.apps.googleusercontent.com">
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/summary" element={<SummaryPage />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/signup" element={<Signup />} /> 
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>

      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
