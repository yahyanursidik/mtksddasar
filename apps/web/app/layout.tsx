import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Math SD — Pahami Caranya, Latih Sampai Lancar",
  description:
    "Aplikasi web latihan matematika dasar untuk anak usia SD dengan fokus pada pemahaman konsep dan fakta hitung.",
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
              className="font-bold text-xl text-stone-900 tracking-tight hover:text-amber-700 transition-colors"
            >
              Math SD
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
              <Link
                href="/"
                className="px-3 py-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/belajar"
                className="px-3 py-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              >
                Belajar
              </Link>
              <Link
                href="/latihan"
                className="px-3 py-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              >
                Latihan
              </Link>
              <Link
                href="/progres"
                className="px-3 py-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
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
