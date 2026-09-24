import Link from "next/link";
import { PageContainer, buttonStyles } from "@math-sd/ui";
import { INITIAL_SKILLS } from "@math-sd/curriculum";

export default function HomePage() {
  const operations = [
    {
      name: "Penjumlahan",
      symbol: "+",
      desc: "Menggabungkan objek",
      href: "/belajar/tambah",
      practiceHref: "/latihan/tambah",
    },
    {
      name: "Pengurangan",
      symbol: "−",
      desc: "Mengambil & selisih",
      href: "/belajar/kurang",
      practiceHref: "/latihan/kurang",
    },
    {
      name: "Perkalian",
      symbol: "×",
      desc: "Kelompok sama banyak",
      href: "/belajar/kali",
      practiceHref: "/latihan/kali",
    },
    {
      name: "Pembagian",
      symbol: "÷",
      desc: "Berbagi rata",
      href: "/belajar/bagi",
      practiceHref: "/latihan/bagi",
    },
  ];

  return (
    <PageContainer maxWidth="md" className="flex flex-col items-center justify-center text-center py-10 sm:py-16">
      <div className="space-y-3 max-w-xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900">
          Latihan Matematika Dasar
        </h1>
        <p className="text-base sm:text-lg text-stone-700 font-normal leading-relaxed">
          Pembelajaran konsep dan latihan fakta hitung dasar dengan bantuan alat visual terstruktur.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 w-full max-w-md">
        <Link
          href="/belajar"
          className={buttonStyles({
            size: "lg",
            className: "flex-1 min-w-[160px] w-full",
          })}
        >
          Mulai Belajar
        </Link>
        <Link
          href="/latihan"
          className={buttonStyles({
            size: "lg",
            variant: "outline",
            className: "flex-1 min-w-[160px] w-full",
          })}
        >
          Latihan Soal
        </Link>
      </div>

      <div className="mt-14 w-full">
        <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-4">
          Pilih Operasi Hitung
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {operations.map((op) => (
            <Link
              key={op.name}
              href={op.href}
              className="p-5 rounded-2xl bg-white border border-stone-200 text-stone-800 flex flex-col items-center justify-center shadow-xs hover:border-amber-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <span className="text-3xl font-extrabold text-amber-600 mb-1">
                {op.symbol}
              </span>
              <span className="font-bold text-sm text-stone-900">{op.name}</span>
              <span className="text-xs font-medium text-stone-600 mt-1">{op.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 text-xs font-medium text-stone-600">
        Kurikulum SD Fase A & B • {INITIAL_SKILLS.length} Modul Pembelajaran
      </div>
    </PageContainer>
  );
}
