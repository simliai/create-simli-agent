import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simli Agent",
  description: "A real-time video agent hosted by Simli: face, voice and brain in one API call.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
