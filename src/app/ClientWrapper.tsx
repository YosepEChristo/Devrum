"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token && window.location.pathname !== "/auth") {
      console.log("🔒 Tidak ada token, mengarahkan ke login...");
      router.replace("/auth");
    }
  }, [router]);

  return <>{children}</>;
}
