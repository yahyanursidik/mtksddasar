import type { Metadata } from "next";
import Link from "next/link";
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
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900 selection:bg-amber-100 font-sans antialiased">
        <header className="border-b border-stone-200 bg-white/90 sticky top-0 z-20 backdrop-blur-xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="font-bold text-xl text-stone-900 tracking-tight hover:text-amber-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            >
              Math SD
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
              <Link
                href="/"
                className="min-h-[48px] px-2.5 sm:px-3 flex items-center rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Beranda
              </Link>
              <Link
                href="/belajar"
                className="min-h-[48px] px-2.5 sm:px-3 flex items-center rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Belajar
              </Link>
              <Link
                href="/latihan"
                className="min-h-[48px] px-2.5 sm:px-3 flex items-center rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Latihan
              </Link>
              <Link
                href="/progres"
                className="min-h-[48px] px-2.5 sm:px-3 flex items-center rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Progres
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
