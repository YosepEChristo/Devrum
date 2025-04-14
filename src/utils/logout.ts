import Cookies from "js-cookie";

const logout = (): void => {
  try {
    console.log("🔘 Logout dimulai...");

    // Hapus token dari localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("selectedProjectId");
    localStorage.removeItem("organizationName");

    // Hapus token dari sessionStorage
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("expiresIn");

    // Hapus cookies via js-cookie
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Hapus semua cookie domain (termasuk dari Azure AD)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    console.log(
      "✅ Semua token & data lokal dihapus. Redirect ke logout backend..."
    );

    // Langsung redirect ke API logout → akan lanjut logout dari Azure AD
    window.location.href = "/api/auth/logout";
  } catch (error) {
    console.error("❌ Logout error:", error);
    // Fallback: tetap arahkan ke login
    window.location.href = "/auth";
  }
};

export default logout;
