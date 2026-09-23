# Product Brief — Math SD MVP

## 1. Ringkasan

Math SD adalah aplikasi web pembelajaran matematika dasar untuk siswa SD.

MVP berfokus pada empat operasi hitung:

- tambah;
- kurang;
- kali;
- bagi.

Setiap operasi tidak hanya memberikan soal, tetapi memperlihatkan dasar konsep, visualisasi, strategi, langkah penyelesaian, latihan terbimbing, latihan acak, dan latihan recall.

## 2. Masalah yang Ingin Diselesaikan

Banyak latihan matematika digital berhenti pada pola:

**soal → jawab → benar/salah**

Padahal anak memerlukan:

- representasi konkret;
- visual;
- penjelasan proses;
- kesempatan mencoba;
- bantuan bertahap;
- pengulangan;
- penguatan fakta hitung.

MVP ini dirancang untuk mengisi kebutuhan tersebut.

## 3. Sasaran Pengguna

Utama:

- anak SD;
- terutama fase A dan fase B sebagai titik awal;
- dapat digunakan mandiri dengan pendampingan ringan.

Sekunder:

- orang tua;
- guru;
- pendamping belajar.

Namun pada MVP belum tersedia akun dan dashboard.

## 4. Nilai Utama Produk

### Understand
Anak mengetahui makna operasi.

### See
Anak melihat representasi operasi.

### Try
Anak mencoba dengan bantuan.

### Practice
Anak mengerjakan latihan acak.

### Recall
Anak menguatkan fakta hitung.

## 5. Prinsip Pembelajaran

Alur utama:

```text
Concrete
↓
Pictorial
↓
Abstract
↓
Strategy
↓
Guided Practice
↓
Independent Practice
↓
Recall
```

## 6. Scope MVP

### Operasi

#### Penjumlahan
- tambah sampai 10;
- tambah sampai 20;
- tambah dua digit sederhana;
- strategi make-ten;
- nilai tempat;
- regrouping dasar.

#### Pengurangan
- kurang sampai 10;
- kurang sampai 20;
- pengurangan dua digit sederhana;
- counting back;
- menuju 10;
- regrouping dasar.

#### Perkalian
- makna perkalian;
- equal groups;
- repeated addition;
- array;
- skip counting;
- fakta ×1, ×2, ×5, ×10;
- perluasan ke ×3, ×4, ×6, ×7, ×8, ×9.

#### Pembagian
- sharing;
- grouping;
- hubungan pembagian dengan perkalian;
- fact family;
- pembagian tanpa sisa pada tahap MVP awal.

## 7. Fitur MVP

- landing/home;
- pilih operasi;
- daftar topik;
- halaman belajar konsep;
- manipulatif visual;
- contoh langkah demi langkah;
- latihan terbimbing;
- latihan acak;
- mode recall sederhana;
- hint bertingkat;
- feedback kesalahan;
- progress lokal selama sesi;
- localStorage opsional untuk menyimpan progres di perangkat yang sama.

## 8. Tanpa Akun

MVP tidak memiliki:

- login;
- signup;
- email;
- OTP;
- PIN anak;
- role;
- database akun.

Aplikasi harus bisa langsung digunakan.

Jika progress lokal dipakai, simpan hanya di browser menggunakan localStorage.

Berikan tombol:

**Reset Progres**

dengan konfirmasi sederhana.

## 9. Bukan Bagian MVP

Belum dikerjakan:

- pecahan;
- desimal;
- geometri;
- pengukuran;
- dashboard sekolah;
- class management;
- assignment;
- laporan orang tua;
- sinkronisasi cloud;
- AI tutor;
- word problem generator berbasis AI;
- multiplayer;
- leaderboard.

## 10. Prinsip Produk

Jangan membuat anak sekadar cepat.

Prioritas:

1. memahami;
2. benar;
3. konsisten;
4. baru kemudian lancar.

Kecepatan tidak boleh menjadi ukuran utama pada awal belajar.

## 11. Success Criteria MVP

MVP dianggap berhasil jika:

- anak dapat memahami makna keempat operasi;
- anak dapat melihat lebih dari satu representasi matematika;
- anak dapat membuka solusi langkah demi langkah;
- latihan dapat menghasilkan variasi soal yang valid;
- hint membantu tanpa langsung membocorkan jawaban;
- UI mudah dipahami tanpa instruksi panjang;
- aplikasi nyaman digunakan di tablet dan desktop;
- aplikasi tidak terasa seperti dashboard SaaS;
- tidak ada UI generik AI/slop.
