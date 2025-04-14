import Cookies from "js-cookie";

const logout = async (): Promise<void> => {
  try {
    console.log("🔘 Logout dimulai...");

    // 🔴 Bersihkan token dari localStorage & sessionStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("selectedProjectId");
    localStorage.removeItem("organizationName");

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("expiresIn");

    // 🔴 Hapus cookie token
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // 🔴 Hapus cookie dari domain (SSO)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log("✅ Semua token & cookie dihapus.");

    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      // ✅ Di Vercel/production, langsung redirect ke backend
      console.log("🌐 Production mode: redirect langsung ke /api/auth/logout");
      window.location.href = "/api/auth/logout";
    } else {
      // ✅ Di lokal: fetch dulu supaya bisa log, baru redirect
      console.log("🧪 Development mode: pakai fetch ke /api/auth/logout");

      const response = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.redirected) {
        console.log("🔁 Redirected ke Azure AD logout...");
        window.location.href = response.url;
      } else {
        console.log("➡️ Tidak diarahkan otomatis. Manual ke /auth");
        window.location.href = "/auth";
      }
    }
  } catch (error) {
    console.error("❌ Logout gagal:", error);
    window.location.href = "/auth";
  }
};

export default logout;
