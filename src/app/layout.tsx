// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Condensed } from "next/font/google";
import { ProjectContextProvider } from "@/context/ProjectContext";

// Use Roboto Condensed font
const robotoCondensed = Roboto_Condensed({
  weight: ["400", "700"], // Specify the weights you need
  subsets: ["latin"],
  variable: "--font-roboto-condensed", // Custom CSS variable for the font
});

export const metadata: Metadata = {
  title: "Devrum",
  description: "App to monitor developer productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robotoCondensed.className}>
        <ProjectContextProvider>
          {" "}
          {/* Wrap with the context provider */}
          <main>{children}</main>
        </ProjectContextProvider>
      </body>
    </html>
  );
}
