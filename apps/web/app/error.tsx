"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PageContainer, Button, buttonStyles } from "@math-sd/ui";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for inspection
    console.error("Application error:", error);
  }, [error]);

  return (
    <PageContainer maxWidth="sm" className="py-20 flex flex-col items-center justify-center text-center">
      <div className="space-y-3 max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 text-2xl font-bold flex items-center justify-center mx-auto">
          !
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Terjadi Kendala
        </h1>
        <p className="text-sm text-stone-700 leading-relaxed">
          Halaman mengalami kendala saat memuat data. Kamu bisa mencoba memuat ulang halaman ini.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-xs">
        <Button size="md" variant="primary" onClick={() => reset()} className="flex-1">
          Coba Lagi
        </Button>
        <Link
          href="/"
          className={buttonStyles({
            size: "md",
            variant: "outline",
            className: "w-full flex-1",
          })}
        >
          Ke Beranda
        </Link>
      </div>
    </PageContainer>
  );
}
