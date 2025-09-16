// LoginPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { loginWithGoogle, login} = useAuth(); // use loginWithGoogle for Google OAuth

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Email/password login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("https://clipnote-2ymu.vercel.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.user && data.token) {
        login(data.user, data.token); // keep old login for email/password
        navigate("/summary"); // redirect to summary page
      } else {
        setMessage("❌ " + (data.error || "Login failed"));
      }
    } catch {
      setMessage("❌ Network error, please try again");
    }
  };

  // Google login
  const handleGoogleLogin = (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      setMessage("❌ Google login failed");
      return;
    }

    try {
      loginWithGoogle(credentialResponse.credential); // decode and store user + token
      navigate("/summary"); // redirect after login
    } catch (err) {
      console.error(err);
      setMessage("❌ Google login failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex flex-grow items-center justify-center mt-44 mb-32">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
          <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back 👋</h2>
          <p className="text-gray-600 mb-6 text-center">
            Please log in to continue to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              Login
            </button>
          </form>

          {message && <p className="mt-4 text-center text-sm">{message}</p>}

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setMessage("❌ Google login failed")}
              useOneTap={false} // optional: avoid FedCM/OneTap issues
            />
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-green-600 hover:underline cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
