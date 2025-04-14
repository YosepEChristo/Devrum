import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", [
    serialize("accessToken", "", {
      path: "/",
      maxAge: -1,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    }),
    serialize("refreshToken", "", {
      path: "/",
      maxAge: -1,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    }),
  ]);

  const redirectUri = encodeURIComponent(
    process.env.LOGOUT_REDIRECT_URI as string
  );

  const logoutUrl = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${redirectUri}`;

  res.redirect(logoutUrl);
}
