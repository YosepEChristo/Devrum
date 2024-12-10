"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { startTokenRefresh } from "@/utils/refreshTokenHandler";

export function SignIn() {
  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  useEffect(() => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    const expiresIn = sessionStorage.getItem("expiresIn");

    if (refreshToken && expiresIn) {
      startTokenRefresh(refreshToken, parseInt(expiresIn, 10));
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-5 text-center w-[600px] h-[396px]">
        <Image
          src="/assets/devrum.png"
          alt="Devrum Logo"
          width={250}
          height={71}
          className="mx-auto mt-[33px] mb-[100px]"
        />

        <button
          className="bg-purple_s hover:bg-blue_s text-white font-medium py-2 px-6 rounded-full 
          w-[350px] h-[70px] text-[22px]"
          onClick={handleLogin}
        >
          Login with Azure Account
        </button>

        <p className="mt-4 text-blue_s text-sm font-regular">
          Don&apos;t have an account yet?
        </p>
      </div>
    </div>
  );
}

export default SignIn;
