import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", [
    serialize("accessToken", "", {
      maxAge: -1, // Hapus cookie
      path: "/",
    }),
    serialize("refreshToken", "", {
      maxAge: -1, // Hapus cookie
      path: "/",
    }),
  ]);

  res.status(200).json({ message: "Logout successful" });
}
