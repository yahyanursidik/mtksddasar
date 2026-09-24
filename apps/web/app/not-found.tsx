import Link from "next/link";
import { PageContainer, buttonStyles } from "@math-sd/ui";

export default function NotFound() {
  return (
    <PageContainer maxWidth="sm" className="py-20 flex flex-col items-center justify-center text-center">
      <div className="space-y-3 max-w-sm">
        <span className="text-4xl font-extrabold text-amber-700">404</span>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-stone-700 leading-relaxed">
          Materi atau halaman yang kamu tuju tidak ditemukan atau alamat URL belum tepat.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-xs">
        <Link
          href="/"
          className={buttonStyles({
            size: "md",
            variant: "primary",
            className: "w-full flex-1",
          })}
        >
          Ke Beranda
        </Link>
        <Link
          href="/belajar"
          className={buttonStyles({
            size: "md",
            variant: "outline",
            className: "w-full flex-1",
          })}
        >
          Pusat Belajar
        </Link>
      </div>
    </PageContainer>
  );
}
