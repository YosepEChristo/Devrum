import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Condensed } from "next/font/google";
import RefreshTokenInitializer from "@/components/RefreshTokenInitializer";
import { Providers } from "@/provider/Provider";
import ClientWrapper from "./ClientWrapper"; // 🔹 Tambahkan ClientWrapper

// Gunakan font Roboto Condensed
const robotoCondensed = Roboto_Condensed({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: "Devrum",
  description: "App to monitor developer productivity",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robotoCondensed.className}>
        <Providers>
          <ClientWrapper>
            <RefreshTokenInitializer />{" "}
            {/* 🔹 Bungkus dengan komponen client */}
            <main>{children}</main>
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
