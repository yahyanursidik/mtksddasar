import Link from "next/link";
import { PageContainer, buttonStyles } from "@math-sd/ui";

export default function LatihanHubPage() {
  const operations = [
    {
      id: "kali",
      name: "Perkalian",
      symbol: "×",
      desc: "Latihan fakta perkalian dan perkalian acak",
      levels: [
        { level: 1, label: "Level 1: Fakta ×1, ×2, ×5, ×10" },
        { level: 2, label: "Level 2: Fakta ×3, ×4" },
        { level: 3, label: "Level 3: Fakta ×6, ×7, ×8, ×9" },
      ],
    },
    {
      id: "tambah",
      name: "Penjumlahan",
      symbol: "+",
      desc: "Penjumlahan satu & dua digit dengan strategi",
      levels: [
        { level: 1, label: "Level 1: Sampai 10" },
        { level: 2, label: "Level 2: Menuju 10 (Make Ten)" },
        { level: 3, label: "Level 3: Dua Digit" },
      ],
    },
    {
      id: "kurang",
      name: "Pengurangan",
      symbol: "−",
      desc: "Pengurangan tanpa hasil negatif",
      levels: [
        { level: 1, label: "Level 1: Pengurangan sampai 10" },
        { level: 2, label: "Level 2: Melewati 10 (Bridge Ten)" },
        { level: 3, label: "Level 3: Dua Digit" },
      ],
    },
    {
      id: "bagi",
      name: "Pembagian",
      symbol: "÷",
      desc: "Pembagian bulat exact dan keluarga fakta",
      levels: [
        { level: 1, label: "Level 1: Bagi 1, 2, 5, 10" },
        { level: 2, label: "Level 2: Bagi 3, 4" },
        { level: 3, label: "Level 3: Bagi 6, 7, 8, 9" },
      ],
    },
  ];

  return (
    <PageContainer maxWidth="md" className="py-8 sm:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Latihan Matematika
        </h1>
        <p className="text-stone-700 text-base leading-relaxed">
          Setiap sesi latihan berisi 10 soal acak sesuai tingkat kesulitan yang dipilih, dilengkapi petunjuk bertahap.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {operations.map((op) => (
          <div
            key={op.id}
            className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-extrabold text-amber-600">
                  {op.symbol}
                </span>
                <h2 className="text-xl font-bold text-stone-900">{op.name}</h2>
              </div>
              <p className="text-xs font-semibold text-stone-600 mb-4">{op.desc}</p>

              <div className="space-y-2">
                {op.levels.map((lvl) => (
                  <Link
                    key={lvl.level}
                    href={`/latihan/${op.id}?level=${lvl.level}`}
                    className="min-h-[48px] flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-400 text-stone-900 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <span>{lvl.label}</span>
                    <span className="text-amber-700 font-bold">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100">
              <Link
                href={`/latihan/${op.id}?level=1`}
                className={buttonStyles({
                  variant: "primary",
                  size: "md",
                  className: "w-full",
                })}
              >
                Mulai 10 Soal {op.name} →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
