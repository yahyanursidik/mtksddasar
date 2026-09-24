import Link from "next/link";
import { PageContainer, buttonStyles } from "@math-sd/ui";
import { INITIAL_SKILLS } from "@math-sd/curriculum";

export default function HomePage() {
  const operations = [
    {
      id: "tambah",
      name: "Penjumlahan",
      symbol: "+",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      tagline: "Menggabungkan Objek & Menuju 10",
      moduleCount: "3 Modul Belajar",
      desc: "Belajar menggabungkan benda nyata, bingkai sepuluh (ten-frame), dan strategi pemisahan puluhan.",
      href: "/belajar/tambah",
      practiceHref: "/latihan/tambah",
    },
    {
      id: "kurang",
      name: "Pengurangan",
      symbol: "−",
      badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
      tagline: "Mengambil Objek & Mundur Melewati 10",
      moduleCount: "2 Modul Belajar",
      desc: "Pahami sisa dan selisih dengan lompatan garis bilangan serta strategi mundur melewati angka 10.",
      href: "/belajar/kurang",
      practiceHref: "/latihan/kurang",
    },
    {
      id: "kali",
      name: "Perkalian",
      symbol: "×",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      tagline: "Kelompok Sama & Susunan Baris-Kolom",
      moduleCount: "3 Modul Belajar",
      desc: "Pahami perkalian bukan hafalan, melainkan kelompok benda berulang dan susunan kisi array konkret.",
      href: "/belajar/kali",
      practiceHref: "/latihan/kali",
    },
    {
      id: "bagi",
      name: "Pembagian",
      symbol: "÷",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      tagline: "Berbagi Rata & Kebalikan Perkalian",
      moduleCount: "3 Modul Belajar",
      desc: "Bagikan benda secara adil ke dalam wadah dan hubungkan langsung dengan fakta perkalian kebalikannya.",
      href: "/belajar/bagi",
      practiceHref: "/latihan/bagi",
    },
  ];

  return (
    <PageContainer maxWidth="lg" className="py-8 sm:py-14 space-y-12">
      {/* Hero Header Section */}
      <section className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs sm:text-sm font-bold shadow-2xs">
          <span>🎒</span>
          <span>Matematika SD • Fase A & B (Kelas 1–4)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-900 leading-tight">
          Pahami Konsepnya, Lancar Berhitungnya!
        </h1>

        <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-xl">
          Bukan sekadar menghafal rumus. Di sini anak-anak belajar matematika dengan benda nyata, balok warna-warni, serta petunjuk interaktif langkah demi langkah.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full max-w-md">
          <Link
            href="/belajar"
            className={buttonStyles({
              size: "lg",
              variant: "primary",
              className: "w-full sm:flex-1",
            })}
          >
            🚀 Mulai Belajar Konsep
          </Link>
          <Link
            href="/latihan"
            className={buttonStyles({
              size: "lg",
              variant: "outline",
              className: "w-full sm:flex-1",
            })}
          >
            ✏️ Latihan 10 Soal
          </Link>
        </div>
      </section>

      {/* 4 Operations Grid Section */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
            Pilih Operasi Hitung
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            4 Materi Pokok Berhitung Dasar
          </h2>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            Setiap materi dilengkapi contoh bertahap, ilustrasi objek nyata, tantangan soal cerita kontekstual, dan lembar kerja (LKPD).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {operations.map((op) => (
            <div
              key={op.id}
              className="rounded-3xl bg-white border-2 border-stone-200 border-b-6 border-b-stone-300 p-6 flex flex-col justify-between shadow-xs hover:border-amber-400 hover:border-b-amber-500 hover:-translate-y-1 transition-all select-none"
            >
              <div className="space-y-4">
                {/* Icon & Symbol Header */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl font-black shadow-2xs ${op.badgeColor}`}
                  >
                    {op.symbol}
                  </div>
                  <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                    {op.moduleCount}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-stone-900">
                    {op.name}
                  </h3>
                  <p className="text-xs font-bold text-amber-800 mt-0.5">
                    {op.tagline}
                  </p>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {op.desc}
                  </p>
                </div>
              </div>

              {/* Action Buttons for this operation */}
              <div className="pt-5 mt-4 border-t border-stone-100 flex flex-col gap-2">
                <Link
                  href={op.href}
                  className={buttonStyles({
                    size: "sm",
                    variant: "primary",
                    className: "w-full",
                  })}
                >
                  📖 Pelajari Konsep →
                </Link>
                <Link
                  href={op.practiceHref}
                  className={buttonStyles({
                    size: "sm",
                    variant: "secondary",
                    className: "w-full",
                  })}
                >
                  ✏️ Coba Latihan Soal
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Features Banner */}
      <section className="rounded-3xl bg-amber-50/70 border-2 border-amber-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
            Lembar Kerja Peserta Didik (LKPD)
          </span>
          <h3 className="text-lg sm:text-xl font-black text-stone-900">
            Bisa Dikerjakan Interaktif atau Dicetak untuk Kelas
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 max-w-xl">
            Semua {INITIAL_SKILLS.length} modul memiliki lembar kerja mandiri dengan kunci jawaban otomatis dan format standar siap cetak atau ekspor PDF untuk bimbingan guru dan orang tua.
          </p>
        </div>

        <Link
          href="/belajar"
          className={buttonStyles({
            size: "md",
            variant: "primary",
            className: "shrink-0",
          })}
        >
          Lihat Semua Modul →
        </Link>
      </section>
    </PageContainer>
  );
}
