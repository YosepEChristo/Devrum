import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Hapus cookie
  res.setHeader("Set-Cookie", [
    serialize("accessToken", "", {
      path: "/",
      maxAge: -1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    }),
    serialize("refreshToken", "", {
      path: "/",
      maxAge: -1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    }),
  ]);

  // Pakai endpoint logout Azure v1.0 (bukan v2.0)
  const redirectUri = encodeURIComponent(
    process.env.REDIRECT_URI || "http://localhost:3000/auth"
  );

  const logoutUrl = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${redirectUri}`;

  res.redirect(logoutUrl);
}
