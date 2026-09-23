import { notFound } from "next/navigation";
import { PageContainer } from "@math-sd/ui";
import { Operation } from "@math-sd/math-engine";
import { PracticeSessionView } from "./PracticeSessionView";

const OP_MAP: Record<string, { opKey: Operation; name: string }> = {
  tambah: { opKey: "addition", name: "Penjumlahan" },
  kurang: { opKey: "subtraction", name: "Pengurangan" },
  kali: { opKey: "multiplication", name: "Perkalian" },
  bagi: { opKey: "division", name: "Pembagian" },
};

export default async function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ operation: string }>;
  searchParams: Promise<{ level?: string }>;
}) {
  const { operation } = await params;
  const { level: levelStr } = await searchParams;

  const info = OP_MAP[operation];
  if (!info) {
    notFound();
  }

  const level = levelStr ? parseInt(levelStr, 10) || 1 : 1;

  return (
    <PageContainer maxWidth="sm" className="py-6 sm:py-10">
      <PracticeSessionView
        operation={info.opKey}
        operationSlug={operation}
        operationName={info.name}
        level={level}
      />
    </PageContainer>
  );
}
