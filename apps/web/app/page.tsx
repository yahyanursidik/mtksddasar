import Link from "next/link";
import { PageContainer, buttonStyles } from "@math-sd/ui";
import { INITIAL_SKILLS, getSkillsByOperation } from "@math-sd/curriculum";

export default function HomePage() {
  const operations = [
    {
      id: "tambah",
      name: "Penjumlahan",
      symbol: "+",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      tagline: "Objek Nyata, Menuju 10 & Bersusun",
      moduleCount: `${getSkillsByOperation("addition").length} Modul Belajar`,
      desc: "Gabungkan benda nyata, bingkai sepuluh (ten-frame), hingga penjumlahan bersusun (tanpa simpan & simpan).",
      href: "/belajar/tambah",
      practiceHref: "/latihan/tambah",
    },
    {
      id: "kurang",
      name: "Pengurangan",
      symbol: "−",
      badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
      tagline: "Garis Bilangan & Pengurangan Bersusun",
      moduleCount: `${getSkillsByOperation("subtraction").length} Modul Belajar`,
      desc: "Pahami konsep sisa, selisih garis bilangan, hingga teknik meminjam pada pengurangan bersusun.",
      href: "/belajar/kurang",
      practiceHref: "/latihan/kurang",
    },
    {
      id: "kali",
      name: "Perkalian",
      symbol: "×",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      tagline: "Array Baris-Kolom & Perkalian Bersusun",
      moduleCount: `${getSkillsByOperation("multiplication").length} Modul Belajar`,
      desc: "Pahami kelompok berulang, susunan kisi array konkret, serta perkalian bersusun 1 & 2 digit.",
      href: "/belajar/kali",
      practiceHref: "/latihan/kali",
    },
    {
      id: "bagi",
      name: "Pembagian",
      symbol: "÷",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      tagline: "Bagi Rata & Porogapit Ba-Ka-Kur-Tu",
      moduleCount: `${getSkillsByOperation("division").length} Modul Belajar`,
      desc: "Distribusi adil benda nyata hingga pembagian bersusun (Porogapit) langkah Ba-Ka-Kur-Tu tanpa sisa & bersisa.",
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

      {/* Hitung Bersusun & Porogapit Highlight Banner */}
      <section className="rounded-3xl bg-linear-to-br from-amber-50 to-orange-50/50 border-2 border-amber-300/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/70 border border-amber-300 text-amber-950 text-xs font-black">
              <span>✨</span>
              <span>BARU: Modul Hitung Bersusun & Porogapit Interaktif</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Belajar Berhitung Bersusun dengan Visual Langkah demi Langkah
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Dilengkapi visual kolom nilai tempat (Ratusan, Puluhan, Satuan), gelembung angka simpanan, coretan nilai pinjaman, serta siklus interaktif <strong className="text-amber-950 font-bold">Ba-Ka-Kur-Tu</strong> (Bagi, Kali, Kurang, Turunkan) khas sekolah dasar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
            <Link
              href="/belajar/bagi/div-porogapit-exact"
              className={buttonStyles({
                size: "sm",
                variant: "primary",
                className: "justify-center shadow-xs",
              })}
            >
              ➗ Coba Porogapit Ba-Ka-Kur-Tu →
            </Link>
            <Link
              href="/belajar/tambah/add-column-regroup"
              className={buttonStyles({
                size: "sm",
                variant: "secondary",
                className: "justify-center",
              })}
            >
              ➕ Penjumlahan Simpanan →
            </Link>
          </div>
        </div>

        {/* 4 Fast-Access Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-amber-200/80">
          <Link
            href="/belajar/tambah/add-column-no-regroup"
            className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/90 border border-amber-200 hover:border-amber-400 hover:bg-white text-xs font-bold text-stone-800 transition-all shadow-2xs group"
          >
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-black shrink-0 group-hover:scale-105 transition-transform">+</span>
            <span className="truncate">Tambah Bersusun</span>
          </Link>
          <Link
            href="/belajar/kurang/sub-column-regroup"
            className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/90 border border-amber-200 hover:border-amber-400 hover:bg-white text-xs font-bold text-stone-800 transition-all shadow-2xs group"
          >
            <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-900 flex items-center justify-center font-black shrink-0 group-hover:scale-105 transition-transform">−</span>
            <span className="truncate">Kurang Bersusun</span>
          </Link>
          <Link
            href="/belajar/kali/mult-column-two-digit"
            className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/90 border border-amber-200 hover:border-amber-400 hover:bg-white text-xs font-bold text-stone-800 transition-all shadow-2xs group"
          >
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-black shrink-0 group-hover:scale-105 transition-transform">×</span>
            <span className="truncate">Kali 2-Digit Bersusun</span>
          </Link>
          <Link
            href="/belajar/bagi/div-porogapit-exact"
            className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/90 border border-amber-200 hover:border-amber-400 hover:bg-white text-xs font-bold text-stone-800 transition-all shadow-2xs group"
          >
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-black shrink-0 group-hover:scale-105 transition-transform">÷</span>
            <span className="truncate">Porogapit SD</span>
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
