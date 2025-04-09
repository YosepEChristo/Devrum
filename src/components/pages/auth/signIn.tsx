"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { startTokenRefresh } from "@/utils/refreshTokenHandler";

export function SignIn() {
  // Tambahkan state untuk cache buster
  const [cacheBuster, setCacheBuster] = useState("");

  const handleLogin = () => {
    // Generate cache buster unik saat login untuk mencegah cache
    const timestamp = new Date().getTime();
    sessionStorage.setItem("loginAttempt", timestamp.toString());

    // Redirect ke login endpoint dengan parameter unik
    window.location.href = `/api/auth/login?cb=${timestamp}`;
  };

  useEffect(() => {
    // Generate cache buster saat komponen dimuat
    setCacheBuster(new Date().getTime().toString());

    // Clear cache Microsoft/Azure
    const clearMicrosoftCache = () => {
      try {
        // Hapus cache dan storage yang mungkin menyimpan sesi
        if (window.sessionStorage) {
          sessionStorage.removeItem("msal.idtoken");
          sessionStorage.removeItem("msal.accessToken");
          sessionStorage.removeItem("msal.refreshToken");
        }
      } catch (e) {
        console.log("Error clearing Microsoft cache", e);
      }
    };

    clearMicrosoftCache();

    // Cek refresh token
    const refreshToken = sessionStorage.getItem("refreshToken");
    const expiresIn = sessionStorage.getItem("expiresIn");

    if (refreshToken && expiresIn) {
      startTokenRefresh(refreshToken, parseInt(expiresIn, 10));
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-[450px]">
        {/* Logo Devrum */}
        <Image
          src={`/assets/devrum.png?v=${cacheBuster}`}
          alt="Devrum Logo"
          width={220}
          height={60}
          className="mx-auto mt-6"
        />

        {/* Deskripsi Devrum */}
        <p className="mt-4 text-gray-700 text-sm leading-relaxed px-4">
          <strong>Devrum</strong> adalah platform yang membantu Anda mengukur
          produktivitas developer menggunakan metode <strong>Scrum</strong>.
          Dengan integrasi ke <strong>Azure DevOps</strong>, Devrum memungkinkan
          evaluasi kinerja berdasarkan{" "}
          <strong>Story Points, Velocity, dan Bug Fix Score</strong>.
        </p>

        {/* Tombol Login */}
        <button
          className="mt-6 bg-purple_s text-white font-semibold py-3 px-8 rounded-full w-[85%] text-lg shadow-md"
          onClick={handleLogin}
        >
          Login with Azure Account
        </button>

        {/* Informasi Akun */}
        <p className="mt-6 text-gray-600 text-sm">
          Don&apos;t have an account yet?{" "}
          <span
            className="text-blue_s cursor-pointer hover:underline"
            onClick={() => (window.location.href = "https://signup.live.com")}
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
