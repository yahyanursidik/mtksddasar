# Vibe Coding Instructions — Math SD MVP

Dokumen ini digunakan sebagai instruksi utama untuk coding agent.

---

# A. ROLE

Anda adalah senior full-stack engineer, frontend architect, learning-product engineer, dan UI engineer.

Bangun aplikasi matematika SD yang:

- benar secara matematis;
- kuat secara pedagogis;
- sederhana secara UI;
- mudah dirawat;
- tidak overengineered;
- anti AI-slop.

---

# B. WAJIB BACA

Sebelum coding, baca:

1. `00-README.md`
2. `01-PRODUCT-BRIEF.md`
3. `02-LEARNING-DESIGN.md`
4. `03-UI-UX-ANTI-SLOP.md`
5. `04-TECHNICAL-ARCHITECTURE.md`
6. `05-MATH-ENGINE-SPEC.md`
7. `06-MVP-PAGES-AND-FLOWS.md`
8. `08-DEFINITION-OF-DONE.md`

Ikuti juga:

https://github.com/miqdadbadjuber/anti-slop

Jangan mengubah prinsip desain tanpa alasan teknis atau pedagogis yang kuat.

---

# C. STACK

Gunakan:

```text
Next.js 16.3.6+
React 19.3+
TypeScript
Turborepo 2.11.3+
pnpm 12.6+
Tailwind CSS
Zod
```

Deploy target:

```text
Vercel
```

MVP tidak menggunakan database.

---

# D. ATURAN KERJA

## 1. Jangan kerjakan seluruh produk sekaligus

Kerjakan per fase.

Setelah setiap fase:

- jalankan lint;
- jalankan typecheck;
- jalankan test;
- periksa UI;
- perbaiki error sebelum lanjut.

## 2. Jangan install library tanpa alasan

Sebelum memasang dependency baru:

- cek apakah native React/Next/CSS cukup;
- jelaskan fungsi dependency;
- hindari package yang hanya menyelesaikan kebutuhan kecil.

## 3. Jangan overengineering

Tidak perlu:

- microservice;
- event bus;
- Redux;
- GraphQL;
- database;
- auth;
- CMS;
- AI SDK.

---

# E. PHASE 1 — BOOTSTRAP

Buat Turborepo:

```text
apps/web
packages/ui
packages/student-ui
packages/math-engine
packages/question-engine
packages/manipulatives
packages/curriculum
packages/storage
packages/validators
packages/eslint-config
packages/typescript-config
```

Pastikan:

- pnpm workspace valid;
- turbo tasks valid;
- TypeScript strict;
- lint berjalan;
- app Next.js tampil.

Jangan desain halaman kompleks dulu.

---

# F. PHASE 2 — DESIGN FOUNDATION

Buat design tokens:

- spacing;
- font sizes;
- radii;
- border;
- surface;
- semantic colors.

Jangan membuat puluhan token yang belum dipakai.

Bangun primitives:

- Button;
- TextButton;
- PageContainer;
- LearningCard;
- MathExpression;
- ProgressDots;
- InlineNotice.

Jangan memakai card untuk semua elemen.

---

# G. PHASE 3 — MATH ENGINE

Implementasikan:

```text
addition
subtraction
multiplication
division
```

Tambahkan:

```text
explainAddition
explainSubtraction
explainMultiplication
explainDivision
```

Engine harus pure TypeScript.

Tambahkan unit tests.

Jangan lanjut ke UI latihan sebelum math-engine test lulus.

---

# H. PHASE 4 — QUESTION ENGINE

Implementasikan generator:

```ts
generateAdditionQuestion()
generateSubtractionQuestion()
generateMultiplicationQuestion()
generateDivisionQuestion()
```

Constraint wajib:

- range;
- difficulty;
- non-negative subtraction;
- exact division;
- avoid immediate duplicates.

Tambahkan test dengan banyak iterasi.

---

# I. PHASE 5 — MANIPULATIVES

Implementasikan bertahap:

1. CounterSet
2. TenFrame
3. NumberLine
4. ArrayGrid
5. EqualGroups
6. BaseTenBlocks
7. PlaceValueChart

Gunakan SVG/HTML/CSS.

Jangan menggunakan gambar raster untuk representasi matematika.

---

# J. PHASE 6 — LEARNING PAGE

Implementasikan satu vertical slice penuh dahulu:

```text
Perkalian → Equal Groups
```

Flow:

```text
Pahami
↓
Lihat
↓
Bentuk matematika
↓
Coba
↓
Latihan
```

Jangan membangun semua skill sebelum vertical slice ini stabil.

---

# K. PHASE 7 — PRACTICE ENGINE

Buat satu soal per layar.

State minimal:

```ts
currentQuestion
currentIndex
answer
attempts
hintLevel
results
```

Feedback:

- benar;
- salah;
- coba lagi;
- petunjuk;
- lihat cara.

Jangan langsung tampilkan jawaban setelah salah pertama.

---

# L. PHASE 8 — LOCAL PROGRESS

Gunakan abstraction:

```ts
progressStorage
```

Data minimal:

```ts
type LocalProgress = {
  version: number;
  completedSkills: string[];
  attemptsByOperation: Record<string, number>;
  correctByOperation: Record<string, number>;
  difficultFacts: string[];
};
```

Tambahkan migration strategy sederhana melalui `version`.

Tidak ada user ID.

---

# M. PHASE 9 — EXPAND OPERATIONS

Setelah perkalian stabil, implementasikan:

1. penjumlahan;
2. pengurangan;
3. pembagian.

Gunakan komponen bersama, tetapi jangan memaksakan satu visual untuk semua operasi.

---

# N. PHASE 10 — POLISH

Audit:

- tablet;
- mobile;
- desktop;
- keyboard;
- reduced motion;
- contrast;
- loading;
- empty state;
- error state;
- localStorage unavailable.

Hapus semua copy generik dan elemen dekoratif tidak perlu.

---

# O. ATURAN UI KERAS

JANGAN:

- membuat dashboard SaaS;
- gradient ungu-biru generik;
- menggunakan glass card;
- menggunakan mascot;
- memakai emoji sebagai dekorasi utama;
- membuat banyak badge;
- membuat confetti;
- menggunakan ilustrasi AI;
- menambahkan elemen hanya agar layar terlihat penuh.

WAJIB:

- whitespace;
- hierarchy kuat;
- angka besar;
- warna fungsional;
- satu fokus per layar;
- CTA jelas;
- visual matematika programatik.

---

# P. ATURAN MATEMATIKA

Tidak boleh ada:

- jawaban salah;
- pembagian non-exact pada level awal;
- subtraction negatif pada level awal;
- langkah algoritma yang tidak konsisten;
- visual yang jumlah elemennya berbeda dari ekspresi.

Semua logic harus berasal dari engine, bukan hardcode pada UI.

---

# Q. ATURAN COPY

Gunakan Bahasa Indonesia natural.

Preferensi:

```text
Pahami
Coba
Latihan
Lanjut
Periksa
Petunjuk
Lihat Cara
Coba Lagi
```

Hindari:

```text
Unlock
Journey
Explore
Master Your Skills
Level Up
Amazing!
Awesome!
```

Feedback harus tenang.

---

# R. PROMPT MEMULAI PROJECT

Gunakan prompt berikut pada coding agent:

```text
Baca seluruh file Markdown pada root project, terutama PRODUCT-BRIEF, LEARNING-DESIGN, UI-UX-ANTI-SLOP, TECHNICAL-ARCHITECTURE, MATH-ENGINE-SPEC, MVP-PAGES-AND-FLOWS, VIBE-CODING-INSTRUCTIONS, dan DEFINITION-OF-DONE.

Bangun Phase 1 saja: bootstrap monorepo Next.js + Turborepo sesuai dokumen.

Jangan mengerjakan fitur berikutnya.
Jangan menambahkan dependency yang tidak diperlukan.
Gunakan TypeScript strict.
Pastikan pnpm install, lint, typecheck, dan build berhasil.
Setelah selesai, laporkan file yang dibuat, keputusan teknis, dan hasil pengecekan.
```

---

# S. PROMPT PHASE 2

```text
Lanjutkan hanya Phase 2: design foundation.

Baca kembali UI-UX-ANTI-SLOP.md.
Buat design tokens dan primitive components minimum yang dibutuhkan.
Jangan membuat homepage lengkap.
Jangan membuat gradient, glassmorphism, mascot, atau dashboard cards generik.
Pastikan komponen accessible dan responsive.
Jalankan lint, typecheck, test bila ada, dan build.
```

---

# T. PROMPT PHASE 3

```text
Lanjutkan hanya Phase 3: math-engine.

Implementasikan pure TypeScript math engine untuk addition, subtraction, multiplication, division dan explanation steps.

Ikuti MATH-ENGINE-SPEC.md.
Jangan membuat UI.
Tambahkan unit test yang komprehensif.
Pastikan engine tidak memiliki dependency React atau Next.js.
Jalankan test, lint, typecheck dan build.
```

---

# U. PROMPT PHASE 4

```text
Lanjutkan hanya Phase 4: question-engine.

Implementasikan generator soal dengan constraints, exact division, non-negative subtraction, difficulty, dan anti-repeat.

Tambahkan randomized tests setidaknya 1000 generated questions per operasi.
Jangan membuat halaman UI.
Pastikan seluruh invariant matematika lolos.
```

---

# V. PROMPT PHASE 5

```text
Lanjutkan hanya Phase 5: manipulatives.

Implementasikan CounterSet, TenFrame, NumberLine, ArrayGrid, EqualGroups, BaseTenBlocks, dan PlaceValueChart secara bertahap.

Gunakan SVG/HTML/CSS.
Tidak boleh menggunakan gambar AI atau raster untuk representasi matematika.
Setiap komponen harus menerima data secara programatik.
Pastikan accessibility dan reduced motion.
```

---

# W. PROMPT VERTICAL SLICE

```text
Bangun satu vertical slice lengkap untuk:
Perkalian → Equal Groups.

Flow:
Pahami → Lihat → Bentuk Matematika → Coba → Latihan → Ringkasan.

Gunakan math-engine, question-engine dan manipulatives yang sudah dibuat.
Jangan membangun operasi lain dahulu.

UI harus mengikuti anti-slop rules:
satu fokus per layar, angka besar, whitespace, tanpa dashboard SaaS, tanpa dekorasi berlebihan.

Setelah selesai, jalankan seluruh quality checks.
```

---

# X. PROMPT REVIEW

```text
Audit implementasi saat ini terhadap semua file Markdown.

Cari:
- pelanggaran anti-slop;
- duplikasi;
- overengineering;
- dependency tidak perlu;
- kesalahan matematika;
- komponen client yang seharusnya server;
- accessibility issue;
- responsive issue;
- misleading learning flow.

Perbaiki hanya temuan yang nyata.
Jangan menambahkan fitur baru.
```
