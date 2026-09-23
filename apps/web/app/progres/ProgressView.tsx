"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { progressStorage, LocalProgress, DEFAULT_PROGRESS } from "@math-sd/storage";
import { Button } from "@math-sd/ui";

export function ProgressView() {
  const [progress, setProgress] = useState<LocalProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setProgress(progressStorage.getProgress());
    setIsLoaded(true);
  }, []);

  const handleReset = () => {
    progressStorage.resetProgress();
    setProgress(progressStorage.getProgress());
    setShowResetConfirm(false);
  };

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-stone-400 text-sm">
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
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mx-auto font-bold">
          ★
        </div>
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
          Belum Ada Progres Latihan
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">
          Semua catatan latihanmu akan tersimpan di perangkat ini tanpa memerlukan akun. Mari mulai dari materi yang ingin kamu pahami!
        </p>
        <div className="pt-2">
          <Link href="/belajar">
            <Button size="lg">Mulai Belajar Sekarang</Button>
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
      {/* 4 Operations Status */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
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
                    <p className="text-xs text-stone-500 mt-0.5">
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
        <p className="text-xs text-stone-500 mb-4">
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
          <p className="text-xs text-stone-400 italic">
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
          <p className="text-xs text-amber-800 mb-3">
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
      <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
        <span className="text-xs text-stone-400">
          Tersimpan lokal di peramban ini • Versi {progress.version}
        </span>
        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
        >
          Reset Progres Belajar
        </button>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-stone-900">
              Reset Semua Progres?
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Catatan latihan dan modul yang selesai akan diatur ulang dari awal. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
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
