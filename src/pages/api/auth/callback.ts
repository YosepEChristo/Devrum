import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tenantId = process.env.AZURE_AD_TENANT_ID!;
  const clientId = process.env.AZURE_AD_CLIENT_ID!;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET!;
  const redirectUri = process.env.REDIRECT_URI!;

  if (req.method === "GET") {
    const code = req.query.code as string;

    if (!code) {
      res.status(400).json({ error: "Authorization code tidak ditemukan" });
      return;
    }

    try {
      const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          scope: "499b84ac-1321-427f-aa17-267ca6975798/.default offline_access",
        }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      // Hapus HttpOnly agar accessToken bisa diakses oleh JavaScript di client-side
      res.setHeader("Set-Cookie", [
        `accessToken=${access_token}; Path=/; Max-Age=${expires_in}`,
        `refreshToken=${refresh_token}; Path=/; Max-Age=2592000`, // Hapus HttpOnly agar dapat diakses
      ]);

      // Simpan refreshToken dan expiresIn di localStorage menggunakan script
      res.send(`
        <script>
          window.localStorage.setItem('refreshToken', '${refresh_token}');
          window.localStorage.setItem('expiresIn', '${expires_in}');
          window.location.href = "/organizations";
        </script>
      `);
    } catch (error) {
      console.error("Error saat menukarkan authorization code:", error);
      res.status(500).json({ error: "Gagal menukarkan authorization code" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
