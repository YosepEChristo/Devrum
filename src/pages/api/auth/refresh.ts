import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

interface RefreshResponse {
  access_token: string;
  expires_in: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { refreshToken } = req.body;
  const tenantId = process.env.AZURE_AD_TENANT_ID!;
  const clientId = process.env.AZURE_AD_CLIENT_ID!;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET!;

  try {
    const tokenResponse = await axios.post<RefreshResponse>(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        scope: "499b84ac-1321-427f-aa17-267ca6975798/.default offline_access",
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, expires_in } = tokenResponse.data;

    res.status(200).json({
      accessToken: access_token,
      expiresIn: expires_in,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      res
        .status(500)
        .json({ error: error.response?.data || "Gagal memperbarui token" });
    } else {
      console.error("Unexpected Error:", error);
      res.status(500).json({ error: "Unexpected error occurred" });
    }
  }
}
