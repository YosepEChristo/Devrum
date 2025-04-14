import Cookies from "js-cookie";
import { stopTokenRefresh } from "@/utils/refreshTokenHandler";

const logout = async (): Promise<void> => {
  try {
    stopTokenRefresh(); // 🛑 Hentikan refresh token SEBELUM apapun

    console.log("🔘 Logout dimulai...");

    // Hapus token dari localStorage dan sessionStorage
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresIn");

    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("expiresIn");

    // Hapus cookies via js-cookie
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Hapus semua cookie manual
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    console.log("✅ Semua storage lokal dibersihkan");

    // Panggil API backend untuk menghapus cookie server
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("❌ Logout API gagal:", await response.text());
      throw new Error("Logout API gagal");
    }

    const data = await response.json();
    console.log("✅ Server logout:", data.message);

    // Delay untuk menghindari race condition
    setTimeout(() => {
      console.log("🔁 Redirect ke halaman login...");
      window.location.href = "/auth";
    }, 300);
  } catch (error) {
    console.error("❌ Logout gagal:", error);
    window.location.href = "/auth";
  }
};

export default logout;
