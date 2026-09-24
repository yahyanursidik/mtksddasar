"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Beranda", icon: "🏠" },
    { href: "/belajar", label: "Belajar", icon: "📖" },
    { href: "/latihan", label: "Latihan", icon: "✏️" },
    { href: "/progres", label: "Progres", icon: "🏆" },
  ];

  return (
    <header className="border-b-2 border-stone-200 bg-white/95 sticky top-0 z-30 backdrop-blur-xs shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl p-1"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-600 border-2 border-amber-700 border-b-4 border-b-amber-800 text-white font-black text-2xl flex items-center justify-center shadow-xs group-hover:bg-amber-500 transition-colors">
            ±
          </div>
          <div>
            <span className="font-black text-xl text-stone-900 tracking-tight leading-tight block group-hover:text-amber-700 transition-colors">
              Math SD
            </span>
            <span className="text-[11px] font-bold text-amber-800 tracking-wider uppercase block">
              Fase A & B (Kelas 1–4)
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-[44px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  isActive
                    ? "bg-amber-100 text-amber-950 border-2 border-amber-300 border-b-4 border-b-amber-400 shadow-xs"
                    : "text-stone-700 hover:text-stone-950 hover:bg-stone-100 border-2 border-transparent"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
