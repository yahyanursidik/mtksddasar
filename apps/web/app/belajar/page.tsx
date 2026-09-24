import Link from "next/link";
import { PageContainer, buttonStyles } from "@math-sd/ui";
import { getSkillsByOperation } from "@math-sd/curriculum";

export default function BelajarIndexPage() {
  const operations = [
    {
      id: "kali",
      opKey: "multiplication" as const,
      name: "Perkalian",
      symbol: "×",
      headline: "Kelompok Sama & Susunan Array",
      description: "Pahami perkalian bukan sebagai hafalan, melainkan kelompok benda yang berulang dan susunan baris-kolom.",
      color: "border-amber-200 bg-amber-50/30",
    },
    {
      id: "tambah",
      opKey: "addition" as const,
      name: "Penjumlahan",
      symbol: "+",
      headline: "Menggabungkan Objek & Strategi Menuju 10",
      description: "Gabungkan benda konkret, gunakan bingkai sepuluh (ten-frame), dan pisahkan puluhan dengan satuan.",
      color: "border-stone-200 bg-white",
    },
    {
      id: "kurang",
      opKey: "subtraction" as const,
      name: "Pengurangan",
      symbol: "−",
      headline: "Mengambil Objek & Mundur Melewati 10",
      description: "Pahami konsep sisa dan selisih dengan garis bilangan serta melompat mundur melewati angka 10.",
      color: "border-stone-200 bg-white",
    },
    {
      id: "bagi",
      opKey: "division" as const,
      name: "Pembagian",
      symbol: "÷",
      headline: "Berbagi Rata & Pengelompokan",
      description: "Bagikan benda secara adil dan lihat bagaimana pembagian adalah kebalikan langsung dari perkalian.",
      color: "border-stone-200 bg-white",
    },
  ];

  return (
    <PageContainer maxWidth="md" className="py-8 sm:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Daftar Operasi Hitung
        </h1>
        <p className="text-stone-700 text-base leading-relaxed">
          Pilih operasi hitung untuk mempelajari konsep dasar secara visual langkah demi langkah.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {operations.map((op) => {
          const skills = getSkillsByOperation(op.opKey);
          return (
            <div
              key={op.id}
              className={`rounded-2xl border p-6 transition-colors shadow-xs ${op.color}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 text-2xl font-black flex items-center justify-center shrink-0">
                      {op.symbol}
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-stone-900">
                        {op.name}
                      </h2>
                      <p className="text-xs font-bold text-amber-800">
                        {op.headline}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed pt-1">
                    {op.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-lg border border-stone-200">
                  {skills.length} Modul Pembelajaran
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/latihan/${op.id}`}
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    ✏️ Latihan
                  </Link>
                  <Link
                    href={`/belajar/${op.id}`}
                    className={buttonStyles({
                      variant: "primary",
                      size: "sm",
                    })}
                  >
                    Buka Modul {op.name} →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
