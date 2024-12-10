import axios from "axios";

// Function to refresh access token
export async function refreshAccessToken(refreshToken: string) {
  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const clientId = process.env.AZURE_AD_CLIENT_ID;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;

  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        scope: "499b84ac-1321-427f-aa17-267ca6975798/.default offline_access",
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data; // Mengembalikan access token baru
  } catch (error: unknown) {
    console.error("Error refreshing access token:", error);
    throw new Error("Failed to refresh access token");
  }
}

// Function to start token refresh
export function startTokenRefresh(refreshToken: string, expiresIn: number) {
  const refreshInterval = (expiresIn - 60) * 1000; // Refresh 1 menit sebelum kadaluarsa

  setInterval(async () => {
    try {
      const tokenData = await refreshAccessToken(refreshToken);

      // Update cookies dengan token baru
      document.cookie = `accessToken=${tokenData.access_token}; Path=/; Max-Age=${tokenData.expires_in}`;
      document.cookie = `refreshToken=${tokenData.refresh_token}; Path=/; Max-Age=2592000`; // 30 hari
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  }, refreshInterval);
}

// Function to get access token from cookies
export function getAccessTokenFromCookie() {
  const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
  if (match) {
    return match[2];
  }
  return null;
}
