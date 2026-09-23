# Definition of Done — MVP

MVP belum dianggap selesai hanya karena halaman sudah terlihat.

## 1. Product

- [ ] Empat operasi tersedia.
- [ ] Setiap operasi memiliki minimal satu jalur belajar lengkap.
- [ ] Ada latihan random.
- [ ] Ada hint.
- [ ] Ada penjelasan langkah.
- [ ] Ada ringkasan sesi.
- [ ] Tidak perlu login.
- [ ] Tidak perlu signup.

## 2. Learning

- [ ] Concrete tersedia pada skill yang relevan.
- [ ] Pictorial tersedia.
- [ ] Abstract tersedia.
- [ ] Tidak langsung menampilkan rumus tanpa dasar.
- [ ] Feedback salah tidak menghakimi.
- [ ] Jawaban tidak langsung dibocorkan setelah satu kesalahan.
- [ ] Recall dipisahkan dari tahap memahami.

## 3. Mathematics

- [ ] Semua operasi diuji.
- [ ] Exact division valid.
- [ ] Subtraction awal tidak negatif.
- [ ] Visual sesuai jumlah aktual.
- [ ] Explanation steps menghasilkan jawaban akhir yang benar.
- [ ] Generator tidak menghasilkan invalid problem.

## 4. UI

- [ ] Tidak ada generic SaaS dashboard.
- [ ] Tidak ada gradient AI generik.
- [ ] Tidak ada glassmorphism.
- [ ] Tidak ada decorative AI illustration.
- [ ] Angka mudah dibaca.
- [ ] Satu layar memiliki fokus jelas.
- [ ] Tablet nyaman.
- [ ] Mobile tetap usable.
- [ ] Desktop tidak terlalu melebar.

## 5. Accessibility

- [ ] Keyboard usable.
- [ ] Focus visible.
- [ ] Contrast memadai.
- [ ] Reduced motion.
- [ ] Semantic HTML.
- [ ] Touch targets nyaman.

## 6. Engineering

- [ ] `pnpm lint` sukses.
- [ ] `pnpm typecheck` sukses.
- [ ] `pnpm test` sukses.
- [ ] `pnpm build` sukses.
- [ ] Tidak ada TypeScript `any` tanpa alasan.
- [ ] Tidak ada dependency besar tanpa kebutuhan.
- [ ] Tidak ada hardcoded answer pada UI.
- [ ] math-engine bebas React/Next.
- [ ] localStorage melalui abstraction.

## 7. Anti-Slop Review

Sebelum release:

- [ ] hapus copy generik;
- [ ] hapus dekorasi tanpa fungsi;
- [ ] kurangi card yang tidak perlu;
- [ ] kurangi badge yang tidak perlu;
- [ ] periksa spacing;
- [ ] periksa hierarchy;
- [ ] pastikan warna punya fungsi;
- [ ] pastikan visual matematika membantu pemahaman.

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
