import { Operation } from "@math-sd/math-engine";

export type MathFormTerm = {
  term: string;
  role: string;
  explanation: string;
};

export type MathForm = {
  title: string;
  repeatedExpression?: string;
  standardExpression: string;
  terms: MathFormTerm[];
  note?: string;
};

export type SkillObjectType =
  | "apple"
  | "orange"
  | "motorcycle"
  | "pencil"
  | "egg"
  | "cookie"
  | "book"
  | "marble"
  | "car"
  | "dot";

export type Skill = {
  id: string;
  operation: Operation;
  title: string;
  subtitle: string;
  description: string;
  prerequisites: string[];
  representations: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  conceptTitle: string;
  conceptExplanation: string;
  exampleA: number;
  exampleB: number;
  strategy: string;
  objectType?: SkillObjectType;
  mathForm?: MathForm;
  guidedPractice: {
    prompt: string;
    a: number;
    b: number;
    answer: number;
    hint: string;
    objectType?: SkillObjectType;
  };
};

export const INITIAL_SKILLS: Skill[] = [
  // --- PERKALIAN (Vertical Slice Utama) ---
  {
    id: "mult-equal-groups",
    operation: "multiplication",
    title: "Kelompok yang Sama",
    subtitle: "Makna dasar perkalian sebagai kelompok berulang",
    description: "Memahami perkalian sebagai penjumlahan berulang dari kelompok-kelompok yang berisi benda sama banyak.",
    prerequisites: ["add-up-to-10"],
    representations: ["equal-groups", "counters"],
    difficulty: 1,
    conceptTitle: "4 Piring Berisi Jeruk",
    conceptExplanation: "Ketika kita memiliki 4 piring dan setiap piring berisi 3 buah jeruk segar, kita menggunakan perkalian: 4 piring × 3 jeruk = 12 jeruk.",
    exampleA: 4,
    exampleB: 3,
    strategy: "equal-groups",
    objectType: "orange",
    mathForm: {
      title: "Dari Gambar Jeruk ke Bentuk Matematika",
      repeatedExpression: "3 + 3 + 3 + 3 = 12",
      standardExpression: "4 × 3 = 12",
      terms: [
        { term: "4", role: "Banyak Piring (Kelompok)", explanation: "Ada 4 piring wadah." },
        { term: "×", role: "Tanda Kali", explanation: "Menandakan pengelompokan yang berulang." },
        { term: "3", role: "Isi Jeruk Tiap Piring", explanation: "Setiap piring berisi 3 buah jeruk." },
        { term: "=", role: "Sama Dengan", explanation: "Menunjukkan total yang setara." },
        { term: "12", role: "Total Jeruk", explanation: "Total seluruh 12 buah jeruk." },
      ],
      note: "Urutan konseptual: (Banyak Kelompok) × (Isi Tiap Kelompok). 4 kelompok berisi 3 benda ditulis 4 × 3 = 12.",
    },
    guidedPractice: {
      prompt: "Ada 3 wadah apel. Setiap wadah berisi 4 buah apel merah. Berapa jumlah seluruh apel?",
      a: 3,
      b: 4,
      answer: 12,
      hint: "Bayangkan 3 wadah, masing-masing berisi 4 apel: 4 + 4 + 4 = ?",
      objectType: "apple",
    },
  },
  {
    id: "mult-arrays",
    operation: "multiplication",
    title: "Susunan Baris dan Kolom (Array)",
    subtitle: "Melihat perkalian dalam bentuk kisi teratur",
    description: "Memahami perkalian melalui baris dan kolom yang rapi untuk melihat sifat komutatif (a × b = b × a).",
    prerequisites: ["mult-equal-groups"],
    representations: ["array"],
    difficulty: 2,
    conceptTitle: "Tempat Parkir: 3 Baris Motor",
    conceptExplanation: "Di tempat parkir terdapat 3 baris motor yang rapi. Setiap baris memuat 4 motor. Total motor adalah 3 baris × 4 motor = 12 motor.",
    exampleA: 3,
    exampleB: 4,
    strategy: "array",
    objectType: "motorcycle",
    guidedPractice: {
      prompt: "Sebuah rak buku memiliki 2 baris. Setiap baris memuat 6 buku. Berapa total buku?",
      a: 2,
      b: 6,
      answer: 12,
      hint: "Hitung 2 baris × 6 kolom buku = ?",
      objectType: "book",
    },
  },
  {
    id: "mult-facts",
    operation: "multiplication",
    title: "Fakta Hitung Perkalian",
    subtitle: "Mengingat perkalian dengan urutan yang memudahkan",
    description: "Memperkuat fakta hitung perkalian dimulai dari ×1, ×2, ×10, ×5 hingga tabel lainnya.",
    prerequisites: ["mult-arrays"],
    representations: ["number-line"],
    difficulty: 3,
    conceptTitle: "Pola Angka dan Pelompatan",
    conceptExplanation: "Perkalian juga bisa dilihat sebagai loncatan pada garis bilangan. Misalnya perkalian 2 adalah lompat 2 angka secara teratur.",
    exampleA: 6,
    exampleB: 4,
    strategy: "repeated-addition",
    guidedPractice: {
      prompt: "Berapakah hasil dari 7 dikali 5?",
      a: 7,
      b: 5,
      answer: 35,
      hint: "Lompat 5 sebanyak 7 kali: 5, 10, 15, 20, 25, 30, ...",
    },
  },

  // --- PENJUMLAHAN ---
  {
    id: "add-up-to-10",
    operation: "addition",
    title: "Menggabungkan Sampai 10",
    subtitle: "Konsep dasar penjumlahan benda konkret",
    description: "Memahami konsep menggabungkan dua himpunan benda untuk mencari jumlah keseluruhannya.",
    prerequisites: [],
    representations: ["counters", "ten-frame"],
    difficulty: 1,
    conceptTitle: "Menggabungkan Dua Kelompok",
    conceptExplanation: "Penjumlahan berarti mengumpulkan dua atau lebih kelompok benda menjadi satu kesatuan utuh.",
    exampleA: 4,
    exampleB: 3,
    strategy: "count-on",
    objectType: "marble",
    mathForm: {
      title: "Bentuk Penjumlahan Menggabungkan",
      standardExpression: "4 + 3 = 7",
      terms: [
        { term: "4", role: "Suku Pertama", explanation: "Banyak benda di kelompok pertama." },
        { term: "+", role: "Tanda Tambah", explanation: "Menggabungkan dua kelompok menjadi satu." },
        { term: "3", role: "Suku Kedua", explanation: "Banyak benda di kelompok kedua." },
        { term: "=", role: "Sama Dengan", explanation: "Menunjukkan total yang setara." },
        { term: "7", role: "Jumlah Total", explanation: "Total seluruh benda setelah digabungkan." },
      ],
      note: "Urutan bilangan dapat ditukar tanpa mengubah hasil (4 + 3 = 3 + 4 = 7).",
    },
    guidedPractice: {
      prompt: "Ada 5 kelereng biru dan 3 kelereng merah. Berapa jumlah seluruh kelereng?",
      a: 5,
      b: 3,
      answer: 8,
      hint: "Mulai dari 5, lalu hitung maju 3 langkah: 6, 7, 8.",
      objectType: "marble",
    },
  },
  {
    id: "add-make-ten",
    operation: "addition",
    title: "Strategi Menuju 10 (Make Ten)",
    subtitle: "Menguraikan bilangan agar membentuk puluhan utuh",
    description: "Strategi menjumlahkan dengan cara melengkapi bilangan pertama menjadi 10 terlebih dahulu.",
    prerequisites: ["add-up-to-10"],
    representations: ["ten-frame"],
    difficulty: 2,
    conceptTitle: "Bentuk 10 Terlebih Dahulu",
    conceptExplanation: "Ketika menjumlahkan angka seperti 8 + 7, lebih mudah mengambil 2 dari 7 agar 8 menjadi 10 utuh. Sisanya tinggal 5, sehingga 10 + 5 = 15.",
    exampleA: 8,
    exampleB: 7,
    strategy: "make-ten",
    mathForm: {
      title: "Strategi Menuju 10",
      repeatedExpression: "8 + 2 + 5 = 10 + 5 = 15",
      standardExpression: "8 + 7 = 15",
      terms: [
        { term: "8", role: "Bilangan Awal", explanation: "Membutuhkan 2 agar menjadi 10 penuh." },
        { term: "7", role: "Pengurai (2 + 5)", explanation: "Diuraikan menjadi 2 (ke 10) dan 5 (sisa)." },
        { term: "10", role: "Puluhan Lengkap", explanation: "8 + 2 = 10." },
        { term: "5", role: "Sisa Satuan", explanation: "Sisa yang ditambahkan ke puluhan." },
        { term: "15", role: "Hasil Akhir", explanation: "10 + 5 = 15." },
      ],
      note: "Melengkapi puluhan 10 mempermudah perhitungan mental bilangan besar.",
    },
    guidedPractice: {
      prompt: "Berapa 9 + 6 dengan strategi menuju 10?",
      a: 9,
      b: 6,
      answer: 15,
      hint: "9 butuh 1 agar jadi 10. Ambil 1 dari 6 (sisa 5). Maka 10 + 5 = ?",
    },
  },
  {
    id: "add-two-digit",
    operation: "addition",
    title: "Dekomposisi Nilai Tempat",
    subtitle: "Menjumlahkan dua digit: puluhan dengan puluhan, satuan dengan satuan",
    description: "Menguraikan bilangan dua digit ke dalam nilai tempatnya agar mudah dihitung.",
    prerequisites: ["add-make-ten"],
    representations: ["base-ten", "place-value"],
    difficulty: 3,
    conceptTitle: "Pisahkan Puluhan dan Satuan",
    conceptExplanation: "37 + 28 dapat diuraikan: (30 + 20) = 50 dan (7 + 8) = 15. Kemudian 50 + 15 = 65.",
    exampleA: 37,
    exampleB: 28,
    strategy: "decompose-place-value",
    mathForm: {
      title: "Pemisahan Nilai Tempat",
      repeatedExpression: "(30 + 20) + (7 + 8) = 50 + 15 = 65",
      standardExpression: "37 + 28 = 65",
      terms: [
        { term: "37", role: "Bilangan Pertama", explanation: "3 puluhan (30) dan 7 satuan." },
        { term: "28", role: "Bilangan Kedua", explanation: "2 puluhan (20) dan 8 satuan." },
        { term: "50", role: "Jumlah Puluhan", explanation: "30 + 20 = 50." },
        { term: "15", role: "Jumlah Satuan", explanation: "7 + 8 = 15." },
        { term: "65", role: "Hasil Akhir", explanation: "50 + 15 = 65." },
      ],
      note: "Jumlahkan nilai tempat yang sejenis: puluhan dengan puluhan, satuan dengan satuan.",
    },
    guidedPractice: {
      prompt: "Hitung 24 + 15 dengan memisahkan puluhan dan satuan.",
      a: 24,
      b: 15,
      answer: 39,
      hint: "Puluhan: 20 + 10 = 30. Satuan: 4 + 5 = 9. Total = ?",
    },
  },

  // --- PENGURANGAN ---
  {
    id: "sub-up-to-10",
    operation: "subtraction",
    title: "Mengambil Objek Sampai 10",
    subtitle: "Konsep dasar pengurangan sebagai sisa atau selisih",
    description: "Memahami pengurangan sebagai proses memisahkan sejumlah benda dari kumpulan mula-mula.",
    prerequisites: ["add-up-to-10"],
    representations: ["number-line", "counters"],
    difficulty: 1,
    conceptTitle: "Berapa yang Tersisa?",
    conceptExplanation: "Pengurangan terjadi ketika kita mengambil sebagian kue dari piring, menyisakan kue yang belum dimakan.",
    exampleA: 7,
    exampleB: 3,
    strategy: "count-back",
    objectType: "cookie",
    mathForm: {
      title: "Bentuk Pengurangan Mengambil",
      standardExpression: "7 − 3 = 4",
      terms: [
        { term: "7", role: "Bilangan Mula-mula", explanation: "Jumlah seluruh benda awal sebelum diambil." },
        { term: "−", role: "Tanda Kurang", explanation: "Menyatakan pengambilan atau selisih." },
        { term: "3", role: "Bilangan Pengurang", explanation: "Banyak benda yang diambil." },
        { term: "=", role: "Sama Dengan", explanation: "Menunjukkan sisa yang setara." },
        { term: "4", role: "Sisa / Selisih", explanation: "Banyak benda yang tersisa." },
      ],
      note: "Pengurangan bersifat tidak komutatif (7 − 3 ≠ 3 − 7). Bilangan awal harus lebih besar atau sama.",
    },
    guidedPractice: {
      prompt: "Ada 8 kue di atas piring. Dimakan 3 kue. Berapa kue yang tersisa?",
      a: 8,
      b: 3,
      answer: 5,
      hint: "Mulai dari 8, hitung mundur 3 langkah: 7, 6, 5.",
      objectType: "cookie",
    },
  },
  {
    id: "sub-bridge-ten",
    operation: "subtraction",
    title: "Pengurangan Melewati 10",
    subtitle: "Strategi mundur bertahap melalui angka 10",
    description: "Mengurangkan bilangan belasan dengan cara mengurangkan satuannya terlebih dahulu menuju 10.",
    prerequisites: ["sub-up-to-10"],
    representations: ["number-line", "ten-frame"],
    difficulty: 2,
    conceptTitle: "Singgah di Angka 10",
    conceptExplanation: "Untuk 13 - 5, kurangkan 3 terlebih dahulu agar sampai di 10. Lalu kurangkan sisa 2 dari 10, menghasilkan 8.",
    exampleA: 13,
    exampleB: 5,
    strategy: "bridge-ten",
    mathForm: {
      title: "Strategi Singgah di Angka 10",
      repeatedExpression: "(13 − 3) − 2 = 10 − 2 = 8",
      standardExpression: "13 − 5 = 8",
      terms: [
        { term: "13", role: "Bilangan Belasan", explanation: "Dikurangi 3 agar menjadi 10 utuh." },
        { term: "5", role: "Pengurang (3 + 2)", explanation: "Diuraikan menjadi 3 (ke 10) dan 2 (sisa pengurang)." },
        { term: "10", role: "Halte Puluhan", explanation: "13 − 3 = 10." },
        { term: "2", role: "Sisa Pengurang", explanation: "Dikurangkan dari 10." },
        { term: "8", role: "Hasil Akhir", explanation: "10 − 2 = 8." },
      ],
      note: "Singgah di 10 mengubah pengurangan belasan menjadi pengurangan basis 10 yang sederhana.",
    },
    guidedPractice: {
      prompt: "Hitung 14 - 6 dengan singgah di angka 10.",
      a: 14,
      b: 6,
      answer: 8,
      hint: "14 - 4 = 10. Kita masih harus mengurang 2 lagi. 10 - 2 = ?",
    },
  },

  // --- PEMBAGIAN ---
  {
    id: "div-sharing",
    operation: "division",
    title: "Pembagian sebagai Berbagi Rata (Sharing)",
    subtitle: "Membagi sejumlah benda ke dalam kelompok sama rata",
    description: "Memahami pembagian sebagai aktivitas membagikan benda satu per satu secara adil ke sejumlah wadah.",
    prerequisites: ["mult-equal-groups"],
    representations: ["equal-groups"],
    difficulty: 1,
    conceptTitle: "Membagi Sama Rata",
    conceptExplanation: "Jika ada 12 pensil dibagikan sama rata kepada 3 anak, setiap anak akan menerima 4 pensil.",
    exampleA: 12,
    exampleB: 3,
    strategy: "sharing",
    objectType: "pencil",
    mathForm: {
      title: "Bentuk Pembagian Berbagi Rata",
      repeatedExpression: "4 + 4 + 4 = 12  ⟺  3 × 4 = 12",
      standardExpression: "12 ÷ 3 = 4",
      terms: [
        { term: "12", role: "Total Benda (Dividen)", explanation: "Seluruh benda yang akan dibagikan." },
        { term: "÷", role: "Tanda Bagi", explanation: "Membagi sama rata ke beberapa wadah." },
        { term: "3", role: "Banyak Wadah (Pembagi)", explanation: "Banyak kelompok penerima." },
        { term: "=", role: "Sama Dengan", explanation: "Menunjukkan kesetaraan pembagian adil." },
        { term: "4", role: "Isi Tiap Wadah (Hasil)", explanation: "Banyak benda yang didapat setiap wadah." },
      ],
      note: "Pembagian berbagi rata mencari berapa isi setiap wadah jika jumlah wadah sudah diketahui.",
    },
    guidedPractice: {
      prompt: "Ada 15 pensil warna yang dibagikan rata kepada 5 anak. Berapa pensil yang didapat setiap anak?",
      a: 15,
      b: 5,
      answer: 3,
      hint: "15 dibagi ke dalam 5 kelompok: 5 anak × ? pensil = 15 pensil?",
      objectType: "pencil",
    },
  },
  {
    id: "div-grouping",
    operation: "division",
    title: "Pembagian sebagai Pengelompokan (Grouping)",
    subtitle: "Membentuk kelompok dengan isi tertentu",
    description: "Memahami pembagian sebagai mencari berapa banyak kelompok yang dapat dibentuk dengan kapasitas tertentu.",
    prerequisites: ["div-sharing"],
    representations: ["equal-groups", "array"],
    difficulty: 2,
    conceptTitle: "Berapa Kelompok yang Jadi?",
    conceptExplanation: "Ada 12 butir telur. Setiap wadah harus berisi 4 butir telur. Berapa wadah yang dibutuhkan? Kita memerlukan 3 wadah.",
    exampleA: 12,
    exampleB: 4,
    strategy: "grouping",
    objectType: "egg",
    mathForm: {
      title: "Bentuk Pembagian Pengelompokan",
      repeatedExpression: "12 = 4 + 4 + 4  (3 kelompok)",
      standardExpression: "12 ÷ 4 = 3",
      terms: [
        { term: "12", role: "Total Benda (Dividen)", explanation: "Seluruh benda yang akan dikelompokkan." },
        { term: "÷", role: "Tanda Bagi", explanation: "Dikelompokkan dengan kapasitas tertentu." },
        { term: "4", role: "Isi Tiap Kelompok (Pembagi)", explanation: "Kapasitas isi per kelompok." },
        { term: "=", role: "Sama Dengan", explanation: "Menunjukkan kesetaraan." },
        { term: "3", role: "Banyak Kelompok (Hasil)", explanation: "Jumlah kelompok yang terbentuk." },
      ],
      note: "Pembagian pengelompokan mencari berapa banyak kelompok yang bisa terbentuk dari kapasitas tertentu.",
    },
    guidedPractice: {
      prompt: "Ada 18 butir telur. Setiap wadah diisi 6 butir telur. Berapa wadah yang terisi penuh?",
      a: 18,
      b: 6,
      answer: 3,
      hint: "18 butir dikelompokkan per 6: 6, 12, 18. Jadi ada ? kelompok.",
      objectType: "egg",
    },
  },
  {
    id: "div-fact-families",
    operation: "division",
    title: "Keluarga Fakta (Fact Family)",
    subtitle: "Hubungan timbal balik antara perkalian dan pembagian",
    description: "Memahami bahwa pembagian adalah kebalikan langsung dari perkalian.",
    prerequisites: ["div-grouping"],
    representations: ["array"],
    difficulty: 3,
    conceptTitle: "Perkalian dan Pembagian Saling Berhubungan",
    conceptExplanation: "Jika 4 × 3 = 12, maka secara otomatis 12 ÷ 3 = 4 dan 12 ÷ 4 = 3.",
    exampleA: 24,
    exampleB: 6,
    strategy: "multiplication-inverse",
    mathForm: {
      title: "Keluarga Fakta Kali & Bagi",
      repeatedExpression: "4 × 6 = 24  ⟺  24 ÷ 6 = 4",
      standardExpression: "24 ÷ 6 = 4",
      terms: [
        { term: "24", role: "Keseluruhan", explanation: "Hasil kali dari 4 dan 6." },
        { term: "÷", role: "Operasi Kebalikan", explanation: "Mencari faktor pengali yang belum diketahui." },
        { term: "6", role: "Faktor Pengali", explanation: "Faktor yang diketahui." },
        { term: "=", role: "Sama Dengan", explanation: "Menunjukkan kesetaraan." },
        { term: "4", role: "Faktor Pasangan", explanation: "Nilai yang jika dikalikan 6 menghasilkan 24." },
      ],
      note: "Menghafal perkalian otomatis membantu menyelesaikan pembagian dengan cepat.",
    },
    guidedPractice: {
      prompt: "Karena 7 × 4 = 28, berapakah 28 ÷ 7?",
      a: 28,
      b: 7,
      answer: 4,
      hint: "Ingat kembali pasangan perkalian: 7 dikali berapa menghasilkan 28?",
    },
  },
];

export function getSkillsByOperation(operation: Operation): Skill[] {
  return INITIAL_SKILLS.filter((s) => s.operation === operation);
}

export function getSkillById(id: string): Skill | undefined {
  return INITIAL_SKILLS.find((s) => s.id === id);
}

export function getAllSkills(): Skill[] {
  return INITIAL_SKILLS;
}
