import Link from "next/link";
import { PageContainer, Button } from "@math-sd/ui";
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
        <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed">
          Pahami caranya. Coba bersama. Latih sampai lancar.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 w-full max-w-md">
        <Link href="/belajar" className="flex-1 min-w-[160px]">
          <Button size="lg" className="w-full">
            Mulai Belajar
          </Button>
        </Link>
        <Link href="/latihan" className="flex-1 min-w-[160px]">
          <Button size="lg" variant="outline" className="w-full">
            Latihan Soal
          </Button>
        </Link>
      </div>

      <div className="mt-14 w-full">
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          Pilih Operasi Hitung
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {operations.map((op) => (
            <Link
              key={op.name}
              href={op.href}
              className="p-5 rounded-2xl bg-white border border-stone-200 text-stone-800 flex flex-col items-center justify-center shadow-xs hover:border-amber-400 hover:shadow-sm transition-all group cursor-pointer"
            >
              <span className="text-3xl font-extrabold text-amber-600 mb-1 group-hover:scale-110 transition-transform">
                {op.symbol}
              </span>
              <span className="font-bold text-sm text-stone-900">{op.name}</span>
              <span className="text-xs text-stone-500 mt-1">{op.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 text-xs text-stone-400">
        Fase A & B SD • {INITIAL_SKILLS.length} Modul Terstruktur • Tanpa Akun
      </div>
    </PageContainer>
  );
}
