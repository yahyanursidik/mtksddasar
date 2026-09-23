import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@math-sd/ui";
import { getSkillsByOperation } from "@math-sd/curriculum";
import { Operation } from "@math-sd/math-engine";

const OP_MAP: Record<string, { opKey: Operation; name: string; symbol: string }> = {
  tambah: { opKey: "addition", name: "Penjumlahan", symbol: "+" },
  kurang: { opKey: "subtraction", name: "Pengurangan", symbol: "−" },
  kali: { opKey: "multiplication", name: "Perkalian", symbol: "×" },
  bagi: { opKey: "division", name: "Pembagian", symbol: "÷" },
};

export default async function OperationSkillsPage({
  params,
}: {
  params: Promise<{ operation: string }>;
}) {
  const { operation } = await params;
  const info = OP_MAP[operation];

  if (!info) {
    notFound();
  }

  const skills = getSkillsByOperation(info.opKey);

  return (
    <PageContainer maxWidth="md" className="py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/belajar"
          className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors inline-flex items-center gap-1"
        >
          ← Kembali ke Semua Operasi
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-3xl font-extrabold text-amber-600">
            {info.symbol}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Modul {info.name}
          </h1>
        </div>
        <p className="text-stone-600 text-sm mt-1">
          Pelajari konsep secara bertahap mulai dari pemahaman visual hingga latihan mandiri.
        </p>
      </div>

      <div className="space-y-4">
        {skills.map((skill, idx) => (
          <div
            key={skill.id}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-amber-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <h2 className="text-lg font-bold text-stone-900">
                  {skill.title}
                </h2>
              </div>
              <p className="text-xs font-semibold text-amber-700 mt-1">
                {skill.subtitle}
              </p>
              <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                {skill.description}
              </p>
            </div>

            <Link
              href={`/belajar/${operation}/${skill.id}`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 text-white font-medium text-sm hover:bg-amber-700 text-center transition-colors shadow-xs"
            >
              Mulai Pahami →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-stone-200 text-center">
        <Link
          href={`/latihan/${operation}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-950 hover:underline"
        >
          Sudah paham konsepnya? Langsung coba latihan 10 soal {info.name} →
        </Link>
      </div>
    </PageContainer>
  );
}
