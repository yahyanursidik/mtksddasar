import { PageContainer } from "@math-sd/ui";
import { ProgressView } from "./ProgressView";

export default function ProgressPage() {
  return (
    <PageContainer maxWidth="md" className="py-8 sm:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Catatan Progres Belajar
        </h1>
        <p className="text-stone-600 text-base leading-relaxed">
          Lihat seberapa banyak latihan yang telah kamu selesaikan dan materi apa saja yang siap diulang.
        </p>
      </div>

      <ProgressView />
    </PageContainer>
  );
}
