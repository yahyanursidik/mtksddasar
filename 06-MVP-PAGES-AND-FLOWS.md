# MVP Pages & User Flow

## 1. Homepage

Tujuan:

- langsung memahami fungsi aplikasi;
- memilih belajar atau latihan.

Conten utama:

```text
Latihan Matematika Dasar

Pahami caranya.
Coba.
Latih sampai lancar.

[ Mulai Belajar ]
[ Latihan ]
```

Di bawah:

```text
Tambah
Kurang
Kali
Bagi
```

Jangan gunakan hero marketing panjang.

## 2. Halaman Belajar

Route:

```text
/belajar
```

Tampilkan empat operasi.

Setiap operasi memiliki daftar skill.

## 3. Halaman Skill

Contoh:

```text
/belajar/kali/equal-groups
```

Struktur:

### Judul

**Perkalian sebagai kelompok yang sama**

### Pahami

Visual kelompok.

### Lihat

Animasi/representasi.

### Bentuk Matematika

```text
4 kelompok berisi 3

3 + 3 + 3 + 3 = 12

4 × 3 = 12
```

### CTA

**Coba Sendiri**

## 4. Guided Practice

Anak diberi soal dengan opsi bantuan.

Contoh:

```text
Buat 4 kelompok.
Setiap kelompok berisi 3.
```

Lalu:

```text
4 × 3 = [ ]
```

## 5. Latihan

Route:

```text
/latihan/kali
```

Flow:

```text
Pilih level
↓
10 soal
↓
Satu soal per layar
↓
Feedback
↓
Ringkasan
```

## 6. Practice Screen

Susunan:

```text
Kembali             3 / 10

          7 × 6

         [     ]

        [ Periksa ]

Butuh bantuan?
Lihat kelompok
Lihat array
Lihat cara
```

Jangan tampilkan timer besar.

## 7. Feedback

Benar:

```text
Tepat.

7 × 6 = 42

[Lanjut]
```

Salah pertama:

```text
Belum tepat.

[Coba lagi]
[Petunjuk]
```

Jangan langsung bocorkan jawaban.

## 8. Summary

Contoh:

```text
Latihan selesai

8 dari 10 sudah tepat.

Yang bisa diulang:
7 × 8
6 × 7

[Ulangi yang sulit]
[Kembali ke Beranda]
```

Hindari ranking.

## 9. Progres Lokal

Route:

```text
/progres
```

Contoh:

```text
Tambah      Lancar
Kurang      Mulai Paham
Kali        Belajar
Bagi        Belajar
```

Tambahkan:

```text
[Reset Progres]
```

## 10. Empty State

Karena pengguna baru tidak punya progres:

```text
Belum ada latihan.

Mulai dari satu operasi yang ingin kamu pelajari.

[Mulai Belajar]
```

## 11. Flow MVP

```text
Home
↓
Pilih operasi
↓
Pilih skill
↓
Pahami
↓
Lihat contoh
↓
Coba bersama
↓
Latihan
↓
Ringkasan
↓
Simpan lokal
```
