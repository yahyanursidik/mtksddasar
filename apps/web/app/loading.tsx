import { PageContainer } from "@math-sd/ui";

export default function Loading() {
  return (
    <PageContainer maxWidth="sm" className="py-20 flex flex-col items-center justify-center text-center">
      <div
        className="w-10 h-10 rounded-full border-3 border-stone-300 border-t-amber-600 animate-spin motion-reduce:animate-none"
        role="status"
        aria-label="Memuat halaman"
      />
      <p className="mt-4 text-sm font-semibold text-stone-700">
        Memuat materi...
      </p>
    </PageContainer>
  );
}
