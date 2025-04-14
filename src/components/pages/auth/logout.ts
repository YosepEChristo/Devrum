import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  console.log("🔘 API Logout dipanggil, menghapus cookies...");

  // Hapus cookies accessToken & refreshToken
  res.setHeader("Set-Cookie", [
    serialize("accessToken", "", {
      path: "/",
      maxAge: -1, // Hapus cookie
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    }),
    serialize("refreshToken", "", {
      path: "/",
      maxAge: -1, // Hapus cookie
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    }),
  ]);

  console.log("✅ Cookies dihapus, mengarahkan ke Azure AD Logout...");

  // Perbaikan: Tambahkan parameter untuk mencegah SSO otomatis
  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const redirectUri = encodeURIComponent(process.env.REDIRECT_URI as string);

  // Gunakan format logout yang mencegah single sign-on otomatis
  const logoutUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${redirectUri}&prompt=select_account`;
  //test
  res.redirect(logoutUrl);
}
