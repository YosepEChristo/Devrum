// src/components/RefreshTokenInitializer.tsx
"use client";

import { useEffect } from "react";
import { startTokenRefresh } from "@/utils/refreshTokenHandler";

const RefreshTokenInitializer = () => {
  useEffect(() => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const expiresIn = localStorage.getItem("expiresIn");

      if (refreshToken && expiresIn) {
        startTokenRefresh(refreshToken, parseInt(expiresIn, 10));
      } else {
        console.warn("Refresh token atau waktu kedaluwarsa tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error saat memulai token refresh:", error);
    }
  }, []);

  return null; // Tidak ada elemen visual yang dirender
};

export default RefreshTokenInitializer;
