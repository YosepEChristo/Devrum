import Cookies from "js-cookie";

const logout = async (): Promise<void> => {
  try {
    console.log("🔘 Logout dimulai...");

    // Hapus semua sesi lokal terlebih dahulu
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Hapus cookie Microsoft/Azure yang mungkin tersimpan
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    console.log("✅ Data lokal dihapus, memanggil API logout...");

    // Panggil API logout ke backend
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.redirected) {
      console.log("✅ Redirecting to Azure AD logout...");
      window.location.href = response.url; // Redirect ke Azure AD Logout
      return;
    }

    console.log("✅ Semua data pengguna dihapus!");

    // Redirect ke halaman login
    window.location.href = "/auth";
  } catch (error) {
    console.error("❌ Logout gagal:", error);
    // Fallback: redirect ke halaman login jika gagal
    window.location.href = "/auth";
  }
};

export default logout;
