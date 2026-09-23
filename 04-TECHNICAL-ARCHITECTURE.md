# Technical Architecture — Math SD MVP

## 1. Stack

```text
Next.js 16.3.6+
React 19.3+
TypeScript
Turborepo 2.11.3+
pnpm 12.6+
Tailwind CSS
Zod
Vercel
```

Tidak ada database pada MVP.

## 2. Monorepo

```text
math-sd/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── features/
│       └── public/
│
├── packages/
│   ├── ui/
│   ├── student-ui/
│   ├── math-engine/
│   ├── question-engine/
│   ├── manipulatives/
│   ├── curriculum/
│   ├── storage/
│   ├── validators/
│   ├── eslint-config/
│   └── typescript-config/
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 3. apps/web

Satu aplikasi student untuk MVP.

Gunakan App Router.

### Server Components

Gunakan untuk:

- halaman beranda;
- katalog skill;
- halaman materi statis;
- metadata;
- layout.

### Client Components

Gunakan hanya untuk:

- practice session;
- input jawaban;
- drag interaction;
- number line;
- counters;
- animation;
- localStorage;
- progress lokal.

Jangan menambahkan `"use client"` pada root layout.

## 4. packages/math-engine

Pure TypeScript.

Tidak boleh memiliki dependency pada React atau Next.js.

Tanggung jawab:

- operasi matematika;
- strategi;
- decomposition;
- step generator;
- answer validation.

## 5. packages/question-engine

Pure TypeScript.

Tanggung jawab:

- generate question;
- difficulty;
- constraint;
- anti repetition;
- seed optional;
- exact division;
- non-negative subtraction.

## 6. packages/manipulatives

React components:

- CounterSet
- TenFrame
- NumberLine
- ArrayGrid
- EqualGroups
- BaseTenBlocks
- PlaceValueChart
- PartWhole
- BarModel

Data matematika berasal dari math-engine.

## 7. packages/curriculum

Berisi definisi skill.

Contoh:

```ts
type Skill = {
  id: string;
  operation: "addition" | "subtraction" | "multiplication" | "division";
  title: string;
  description: string;
  prerequisites: string[];
  representations: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
};
```

## 8. packages/storage

Local storage adapter.

API internal:

```ts
getProgress()
saveProgress()
resetProgress()
```

Jangan akses `window.localStorage` langsung dari banyak komponen.

Gunakan satu abstraction.

## 9. State

Untuk MVP hindari state-management library besar.

Gunakan:

- React state;
- reducer;
- URL params jika sesuai;
- localStorage adapter.

Jangan memasang Redux/Zustand jika belum diperlukan.

## 10. Routing

Contoh:

```text
/
/belajar
/belajar/tambah
/belajar/tambah/make-ten
/belajar/kurang
/belajar/kali
/belajar/bagi

/latihan
/latihan/tambah
/latihan/kurang
/latihan/kali
/latihan/bagi

/progres
```

## 11. Testing

Minimum:

### Unit test
- math-engine;
- question-engine.

### Component test
- answer input;
- manipulatives penting.

### E2E
- buka homepage;
- pilih operasi;
- belajar;
- mengerjakan latihan;
- hasil tersimpan lokal;
- reset progres.

## 12. Performance

Target:

- tidak memuat library animasi besar tanpa kebutuhan;
- SVG lebih diutamakan;
- lazy-load manipulatif berat;
- tidak ada image-heavy homepage;
- bundle client minimal.

## 13. Data Privacy

Karena tidak ada akun:

- jangan meminta nama lengkap;
- jangan meminta email;
- jangan meminta nomor telepon;
- jangan mengumpulkan data anak;
- analytics pihak ketiga tidak wajib untuk MVP.

Jika analytics ditambahkan kelak, review privacy terlebih dahulu.
