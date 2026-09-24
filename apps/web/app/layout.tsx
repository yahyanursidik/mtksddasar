import type { Metadata } from "next";
import { MainNav } from "./MainNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Math SD — Latihan Matematika Dasar",
  description:
    "Aplikasi web latihan matematika dasar untuk anak usia SD dengan representasi visual konkret-piktorial-abstrak dan umpan balik terstruktur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900 selection:bg-amber-100 font-sans antialiased"
      >
        <MainNav />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
