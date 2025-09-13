import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const { loginWithGoogle, login } = useAuth();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Password strength check
  const isPasswordStrong = (password: string) => {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  };

  // Signup handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!isPasswordStrong(form.password)) {
      setMessage("❌ Password must be 8+ chars, include uppercase, lowercase, number & symbol");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ OTP sent to your email. Please verify.");
        setStep("otp");
      } else {
        setMessage("❌ " + (data.error || "Signup failed"));
      }
    } catch {
      setLoading(false);
      setMessage("❌ Network error, please try again");
    }
  };

  // OTP verification handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ Email verified, logging you in...");
        login(data.token, data.user);
        setTimeout(() => navigate("/summary"), 1500);
      } else {
        setMessage("❌ " + (data.error || "Invalid OTP"));
      }
    } catch {
      setLoading(false);
      setMessage("❌ Network error, please try again");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      setResendLoading(false);

      if (res.ok) {
        setMessage("✅ OTP resent to your email!");
      } else {
        setMessage("❌ " + (data.error || "Failed to resend OTP"));
      }
    } catch {
      setResendLoading(false);
      setMessage("❌ Network error, please try again");
    }
  };

  // Google signup
  const handleGoogleSignup = (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      setMessage("❌ Google signup failed");
      return;
    }

    try {
      loginWithGoogle(credentialResponse.credential);
      navigate("/summary");
    } catch (err) {
      console.error(err);
      setMessage("❌ Google signup failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-grow items-center justify-center mt-32 mb-32">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {step === "signup" ? "Create an Account ✨" : "Verify Your Email 📩"}
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            {step === "signup"
              ? "Sign up to get started with your account"
              : `We sent a 6-digit OTP to ${form.email}`}
          </p>

          {step === "signup" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
            </form>
          )}

          {message && <p className="mt-4 text-center text-sm">{message}</p>}

          {step === "signup" && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSignup}
                  onError={() => setMessage("❌ Google signup failed")}
                  useOneTap={false}
                />
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-green-600 hover:underline cursor-pointer"
                  >
                    Log in
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
