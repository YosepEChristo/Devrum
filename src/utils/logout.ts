import Cookies from "js-cookie";

const logout = async (): Promise<void> => {
  try {
    console.log("🔘 Logout dimulai...");

    // Hapus token di local
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("selectedProjectId");
    localStorage.removeItem("organizationName");

    sessionStorage.clear();

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Hapus semua cookie domain
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    const isProduction = window.location.hostname !== "localhost";

    if (isProduction) {
      console.log("🌐 Production: redirect langsung ke API logout");
      // ✅ Langsung redirect
      window.location.href = "/api/auth/logout";
    } else {
      console.log("🧪 Development: pakai fetch logout");
      const response = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        window.location.href = "/auth";
      }
    }
  } catch (err) {
    console.error("❌ Logout gagal:", err);
    window.location.href = "/auth";
  }
};

export default logout;
