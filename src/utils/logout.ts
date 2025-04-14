import Cookies from "js-cookie";

const logout = async (): Promise<void> => {
  try {
    console.log("🔘 Logout dimulai...");

    // Hapus hanya token yang terkait, bukan semua storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("expiresIn");

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Hapus cookies Microsoft/Azure yang mungkin tersimpan
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    console.log("✅ Token lokal dihapus, menghubungi API logout...");

    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.redirected) {
      console.log("🔁 Dialihkan ke Azure AD logout...");
      window.location.href = response.url;
    } else {
      // Fallback: tetap arahkan ke /auth
      window.location.href = "/auth";
    }
  } catch (error) {
    console.error("❌ Logout gagal:", error);
    window.location.href = "/auth";
  }
};

export default logout;
