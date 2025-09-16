// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user + token from localStorage on app start
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (err) {
      console.error("Failed to load auth from localStorage:", err);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Google login now calls backend
const loginWithGoogle = async (credential: string) => {
  try {
    const res = await fetch("https://clipnote-2ymu.vercel.app/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credential }),
    });

    if (!res.ok) throw new Error("Google login failed");

    const data = await res.json();

    // Save backend JWT and user info
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    setUser(data.user);
    setToken(data.token);
  } catch (err) {
    console.error("Failed Google login:", err);
  }
};


  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
