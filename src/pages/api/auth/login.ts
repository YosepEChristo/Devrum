import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.AZURE_AD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.REDIRECT_URI as string);
  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const scope = encodeURIComponent(
    "499b84ac-1321-427f-aa17-267ca6975798/.default offline_access"
  );

  const authorizationUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

  res.redirect(authorizationUrl);
}
