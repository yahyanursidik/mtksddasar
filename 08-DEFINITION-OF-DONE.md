# Definition of Done — MVP

MVP belum dianggap selesai hanya karena halaman sudah terlihat.

## 1. Product

- [x] Empat operasi tersedia.
- [x] Setiap operasi memiliki minimal satu jalur belajar lengkap.
- [x] Ada latihan random.
- [x] Ada hint.
- [x] Ada penjelasan langkah.
- [x] Ada ringkasan sesi.
- [x] Tidak perlu login.
- [x] Tidak perlu signup.

## 2. Learning

- [x] Concrete tersedia pada skill yang relevan.
- [x] Pictorial tersedia.
- [x] Abstract tersedia.
- [x] Tidak langsung menampilkan rumus tanpa dasar.
- [x] Feedback salah tidak menghakimi.
- [x] Jawaban tidak langsung dibocorkan setelah satu kesalahan.
- [x] Recall dipisahkan dari tahap memahami.

## 3. Mathematics

- [x] Semua operasi diuji.
- [x] Exact division valid.
- [x] Subtraction awal tidak negatif.
- [x] Visual sesuai jumlah aktual.
- [x] Explanation steps menghasilkan jawaban akhir yang benar.
- [x] Generator tidak menghasilkan invalid problem.

## 4. UI

- [x] Tidak ada generic SaaS dashboard.
- [x] Tidak ada gradient AI generik.
- [x] Tidak ada glassmorphism.
- [x] Tidak ada decorative AI illustration.
- [x] Angka mudah dibaca.
- [x] Satu layar memiliki fokus jelas.
- [x] Tablet nyaman.
- [x] Mobile tetap usable.
- [x] Desktop tidak terlalu melebar.

## 5. Accessibility

- [x] Keyboard usable.
- [x] Focus visible.
- [x] Contrast memadai.
- [x] Reduced motion.
- [x] Semantic HTML.
- [x] Touch targets nyaman.

## 6. Engineering

- [x] `pnpm lint` sukses.
- [x] `pnpm typecheck` sukses.
- [x] `pnpm test` sukses.
- [x] `pnpm build` sukses.
- [x] Tidak ada TypeScript `any` tanpa alasan.
- [x] Tidak ada dependency besar tanpa kebutuhan.
- [x] Tidak ada hardcoded answer pada UI.
- [x] math-engine bebas React/Next.
- [x] localStorage melalui abstraction.

## 7. Anti-Slop Review

Sebelum release:

- [x] hapus copy generik;
- [x] hapus dekorasi tanpa fungsi;
- [x] kurangi card yang tidak perlu;
- [x] kurangi badge yang tidak perlu;
- [x] periksa spacing;
- [x] periksa hierarchy;
- [x] pastikan warna punya fungsi;
- [x] pastikan visual matematika membantu pemahaman.

## 8. MVP Release Candidate

Release candidate dianggap siap bila seorang anak dapat:

```text
buka aplikasi
↓
pilih perkalian
↓
memahami equal groups
↓
melihat array
↓
menjawab latihan
↓
meminta petunjuk
↓
melihat penjelasan
↓
menyelesaikan 10 soal
↓
melihat ringkasan
```

tanpa membuat akun dan tanpa bantuan teknis.
