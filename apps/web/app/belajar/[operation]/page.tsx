import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer, buttonStyles } from "@math-sd/ui";
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
          className="text-sm font-semibold text-stone-700 hover:text-stone-950 transition-colors inline-flex items-center gap-1 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg px-1"
        >
          ← Kembali ke Semua Operasi
        </Link>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-3xl font-extrabold text-amber-600">
            {info.symbol}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Modul {info.name}
          </h1>
        </div>
        <p className="text-stone-700 text-sm mt-1">
          Urutan materi disusun bertahap dari pemahaman visual konkret hingga kalimat matematika.
        </p>
      </div>

      <div className="space-y-4">
        {skills.map((skill, idx) => (
          <div
            key={skill.id}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-amber-400 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <h2 className="text-lg font-bold text-stone-900">
                  {skill.title}
                </h2>
              </div>
              <p className="text-xs font-bold text-amber-800 mt-1">
                {skill.subtitle}
              </p>
              <p className="text-sm text-stone-700 mt-1 leading-relaxed">
                {skill.description}
              </p>
            </div>

            <Link
              href={`/belajar/${operation}/${skill.id}`}
              className={buttonStyles({
                variant: "primary",
                size: "md",
                className: "w-full sm:w-auto shrink-0",
              })}
            >
              Mulai Pahami →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-stone-200 text-center">
        <Link
          href={`/latihan/${operation}`}
          className={buttonStyles({
            variant: "outline",
            size: "md",
          })}
        >
          Langsung coba latihan 10 soal {info.name} →
        </Link>
      </div>
    </PageContainer>
  );
}
