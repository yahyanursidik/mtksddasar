import { notFound } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@math-sd/ui";
import { getSkillById } from "@math-sd/curriculum";
import { SkillLearningView } from "./SkillLearningView";

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ operation: string; skillId: string }>;
}) {
  const { operation, skillId } = await params;
  const skill = getSkillById(skillId);

  if (!skill) {
    notFound();
  }

  return (
    <PageContainer maxWidth="md" className="py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href={`/belajar/${operation}`}
          className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors inline-flex items-center gap-1 mb-3"
        >
          ← Kembali ke Modul
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          {skill.title}
        </h1>
        <p className="text-stone-600 text-sm mt-1">
          {skill.subtitle}
        </p>
      </div>

      <SkillLearningView skill={skill} operationSlug={operation} />
    </PageContainer>
  );
}
