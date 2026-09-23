import Link from "next/link";
import { PageContainer } from "@math-sd/ui";
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
          Pusat Pembelajaran
        </h1>
        <p className="text-stone-600 text-base leading-relaxed">
          Pilih operasi hitung di bawah untuk mempelajari konsep dasar dengan alat bantu visual langkah demi langkah.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {operations.map((op) => {
          const skills = getSkillsByOperation(op.opKey);
          return (
            <div
              key={op.id}
              className={`rounded-2xl border p-6 transition-all shadow-xs ${op.color}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-extrabold text-amber-600">
                      {op.symbol}
                    </span>
                    <h2 className="text-xl font-bold text-stone-900">
                      {op.name}
                    </h2>
                  </div>
                  <p className="text-sm font-semibold text-stone-700 mt-0.5">
                    {op.headline}
                  </p>
                  <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
                    {op.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-stone-500">
                  {skills.length} Topik Pembelajaran
                </span>
                <Link
                  href={`/belajar/${op.id}`}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Buka Modul {op.name} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
