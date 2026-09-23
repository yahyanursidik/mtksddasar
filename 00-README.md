# Math SD — MVP

Aplikasi web latihan matematika dasar untuk anak usia SD dengan fokus pada pemahaman konsep, proses berhitung, latihan bertahap, dan penguatan fakta hitung.

## Tujuan MVP

MVP ini **tidak menggunakan login, akun, database pengguna, leaderboard, gamification berlebihan, atau AI API**.

Pengguna langsung membuka aplikasi dan dapat belajar:

- Penjumlahan
- Pengurangan
- Perkalian
- Pembagian

Pendekatan utama:

**Concrete → Pictorial → Abstract → Strategy → Guided Practice → Independent Practice → Recall**

Aplikasi harus membantu anak memahami **mengapa** sebuah jawaban benar, bukan hanya mengejar jawaban akhir.

## Stack

- Next.js 16.3.6+
- React 19.3+
- TypeScript
- Turborepo 2.11.3+
- pnpm 12.6+
- Tailwind CSS
- SVG + HTML/CSS untuk manipulatif matematika
- Zod untuk validasi
- Vercel untuk deployment
- Anti-slop rules: https://github.com/miqdadbadjuber/anti-slop

## Tidak digunakan pada MVP

- Login
- Signup
- Database pengguna
- Neon
- Drizzle
- Refine
- CMS
- AI API
- Leaderboard
- Social features
- Chatbot
- Achievement system yang berlebihan

## Paket dokumen

1. `01-PRODUCT-BRIEF.md`
2. `02-LEARNING-DESIGN.md`
3. `03-UI-UX-ANTI-SLOP.md`
4. `04-TECHNICAL-ARCHITECTURE.md`
5. `05-MATH-ENGINE-SPEC.md`
6. `06-MVP-PAGES-AND-FLOWS.md`
7. `07-VIBE-CODING-INSTRUCTIONS.md`
8. `08-DEFINITION-OF-DONE.md`

## Prinsip Produk

> Paham dulu, kemudian latihan, lalu lancar.

Aplikasi tidak boleh berubah menjadi sekadar bank soal matematika.

Setiap fitur harus mendukung setidaknya satu dari empat tujuan:

1. memahami konsep;
2. melihat proses;
3. mencoba strategi;
4. menguatkan recall.
