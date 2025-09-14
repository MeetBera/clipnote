// src/lib/api.ts
import { useAuth } from "@/context/AuthContext";
import { useCallback } from "react";

const API_BASE = "https://clipnote-2ymu.vercel.app/"; // your backend

export function useApi() {
  const { token } = useAuth();

  // Stable callback to make API requests
  const apiFetch = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      // Wait for token to exist before sending request
      if (!token) {
        throw new Error("No auth token found. Please login.");
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      let data: any = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Include backend error message if available
        const message = data?.error || response.statusText || "Unknown error";
        throw new Error(`API error: ${response.status} - ${message}`);
      }

      return data;
    },
    [token] // re-create whenever token changes
  );

  return { apiFetch };
}
