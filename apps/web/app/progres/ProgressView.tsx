"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { progressStorage, LocalProgress, DEFAULT_PROGRESS } from "@math-sd/storage";
import { InlineNotice, buttonStyles } from "@math-sd/ui";

export function ProgressView() {
  const [progress, setProgress] = useState<LocalProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setProgress(progressStorage.getProgress());
    setStorageAvailable(progressStorage.isStorageAvailable());
    setIsLoaded(true);
  }, []);

  const handleReset = () => {
    progressStorage.resetProgress();
    setProgress(progressStorage.getProgress());
    setShowResetConfirm(false);
  };

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-stone-600 text-sm font-medium">
        Memuat progres belajar...
      </div>
    );
  }

  const operations = [
    {
      key: "multiplication",
      name: "Perkalian",
      symbol: "×",
      slug: "kali",
    },
    {
      key: "addition",
      name: "Penjumlahan",
      symbol: "+",
      slug: "tambah",
    },
    {
      key: "subtraction",
      name: "Pengurangan",
      symbol: "−",
      slug: "kurang",
    },
    {
      key: "division",
      name: "Pembagian",
      symbol: "÷",
      slug: "bagi",
    },
  ];

  const totalAttempts = (Object.values(progress.attemptsByOperation) as number[]).reduce(
    (a, b) => a + b,
    0
  );

  const isEmpty = totalAttempts === 0 && progress.completedSkills.length === 0;

  if (isEmpty) {
    return (
      <div className="text-center py-16 px-4 space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
          Belum Ada Riwayat Latihan
        </h2>
        <p className="text-stone-700 text-sm leading-relaxed">
          Catatan latihan dan modul yang diselesaikan akan dicatat di sini. Mulai dengan mempelajari konsep atau mencoba latihan soal.
        </p>
        {!storageAvailable && (
          <div className="text-left pt-2">
            <InlineNotice variant="info">
              Penyimpanan peramban tidak aktif (misal mode penyamaran). Progres latihan hanya disimpan sementara selama tab ini dibuka.
            </InlineNotice>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 justify-center">
          <Link
            href="/belajar"
            className={buttonStyles({
              size: "lg",
              className: "w-full flex-1",
            })}
          >
            Mulai Belajar
          </Link>
          <Link
            href="/latihan"
            className={buttonStyles({
              size: "lg",
              variant: "outline",
              className: "w-full flex-1",
            })}
          >
            Latihan Soal
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (opKey: string) => {
    const status = progressStorage.getOperationMastery(opKey);
    const styles = {
      Belajar: "bg-stone-100 text-stone-700 border-stone-200",
      "Mulai Paham": "bg-amber-100 text-amber-900 border-amber-300",
      Lancar: "bg-emerald-100 text-emerald-900 border-emerald-300",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {!storageAvailable && (
        <InlineNotice variant="info">
          Penyimpanan peramban (localStorage) tidak aktif atau dibatasi. Catatan latihan hanya dapat dilihat selama sesi ini dan tidak akan tersimpan setelah tab ditutup.
        </InlineNotice>
      )}

      {/* 4 Operations Status */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Status Penguasaan Operasi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {operations.map((op) => {
            const attempts = progress.attemptsByOperation[op.key] ?? 0;
            const correct = progress.correctByOperation[op.key] ?? 0;

            return (
              <div
                key={op.key}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-amber-600">
                    {op.symbol}
                  </span>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">
                      {op.name}
                    </h3>
                    <p className="text-xs font-medium text-stone-600 mt-0.5">
                      {attempts > 0
                        ? `${correct} dari ${attempts} latihan tepat`
                        : "Belum dicoba"}
                    </p>
                  </div>
                </div>
                <div>{getStatusBadge(op.key)}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Completed Skills */}
      <section className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
        <h2 className="text-base font-bold text-stone-900 mb-1">
          Modul Selesai Dipahami
        </h2>
        <p className="text-xs font-medium text-stone-600 mb-4">
          Total {progress.completedSkills.length} materi konsep telah diselesaikan
        </p>

        {progress.completedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {progress.completedSkills.map((skillId: string) => (
              <span
                key={skillId}
                className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800"
              >
                ✓ {skillId}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs font-medium text-stone-600">
            Belum ada modul yang diselesaikan. Buka tab Belajar untuk mencoba!
          </p>
        )}
      </section>

      {/* Difficult Facts Review */}
      {progress.difficultFacts.length > 0 && (
        <section className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs">
          <h2 className="text-base font-bold text-amber-950 mb-1">
            Fakta Hitung yang Perlu Diperkuat
          </h2>
          <p className="text-xs font-medium text-amber-900 mb-3">
            Fakta hitung ini sempat terjawab belum tepat pada sesi sebelumnya:
          </p>
          <div className="flex flex-wrap gap-2">
            {progress.difficultFacts.map((fact: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-sm font-bold text-amber-950 shadow-xs"
              >
                {fact}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Reset Progress Section */}
      <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-medium text-stone-600">
          Tersimpan lokal di peramban ini • Versi {progress.version}
        </span>
        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="min-h-[48px] px-3 py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg inline-flex items-center"
        >
          Reset Progres Belajar
        </button>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowResetConfirm(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-scaleUp motion-reduce:animate-none">
            <h3 id="reset-modal-title" className="text-lg font-bold text-stone-900">
              Reset Semua Progres?
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Catatan latihan dan modul yang selesai akan diatur ulang dari awal. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                autoFocus
                onClick={() => setShowResetConfirm(false)}
                className="min-h-[48px] px-5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[48px] px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
