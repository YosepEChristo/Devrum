import axios from "axios";

let refreshInterval: NodeJS.Timeout | null = null;

/**
 * Mengambil access token dari cookie
 */
export function getAccessTokenFromCookie(): string | null {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ").map((cookie) => cookie.split("="));
  const tokenCookie = cookies.find(([name]) => name === "accessToken");
  return tokenCookie ? decodeURIComponent(tokenCookie[1]) : null;
}

/**
 * Mengambil refresh token dari cookie
 */
export function getRefreshTokenFromCookie(): string | null {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ").map((cookie) => cookie.split("="));
  const tokenCookie = cookies.find(([name]) => name === "refreshToken");
  return tokenCookie ? decodeURIComponent(tokenCookie[1]) : null;
}

/**
 * Menyimpan token ke cookie dengan durasi waktu tertentu
 */
export function setTokenInCookie(
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

  document.cookie = `accessToken=${encodeURIComponent(
    accessToken
  )}; expires=${expirationDate.toUTCString()}; path=/; Secure; SameSite=Strict`;
  document.cookie = `refreshToken=${encodeURIComponent(
    refreshToken
  )}; expires=${expirationDate.toUTCString()}; path=/; Secure; SameSite=Strict`;
}

/**
 * Menghapus token dari cookie (Saat logout)
 */
export function clearTokens() {
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * Memeriksa apakah token valid atau kadaluwarsa
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    const exp = payload.exp * 1000;
    return Date.now() < exp; // True jika token masih valid
  } catch (error) {
    console.error("Invalid token format", error);
    return false;
  }
}

/**
 * Memperbarui token jika access token kadaluwarsa
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshTokenFromCookie();
  if (!refreshToken) {
    console.warn("No refresh token available.");
    return null;
  }

  try {
    const response = await axios.post("/api/auth/refresh", { refreshToken });
    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    } = response.data;

    setTokenInCookie(accessToken, newRefreshToken, expiresIn);
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    return null;
  }
}

/**
 * Memulai interval untuk memperbarui token secara otomatis
 */
export function startTokenRefresh(refreshToken: string, expiresIn: number) {
  if (refreshInterval) clearInterval(refreshInterval);

  const refreshTime = (expiresIn - 60) * 1000; // Refresh sebelum token kadaluwarsa
  refreshInterval = setInterval(async () => {
    console.log("Refreshing access token...");
    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      console.error("Failed to refresh token. User may need to log in again.");
      clearTokens(); // Hapus token jika gagal refresh
      clearInterval(refreshInterval!);
    }
  }, refreshTime);
}
