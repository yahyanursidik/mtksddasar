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
  mathForm?: MathForm;
  guidedPractice: {
    prompt: string;
    a: number;
    b: number;
    answer: number;
    hint: string;
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
    conceptTitle: "Perkalian adalah Kelompok yang Sama",
    conceptExplanation: "Ketika kita memiliki beberapa kelompok dan setiap kelompok berisi jumlah benda yang persis sama, kita bisa menggunakan perkalian.",
    exampleA: 4,
    exampleB: 3,
    strategy: "equal-groups",
    mathForm: {
      title: "Dari Gambar ke Bentuk Matematika",
      repeatedExpression: "3 + 3 + 3 + 3 = 12",
      standardExpression: "4 × 3 = 12",
      terms: [
        { term: "4", role: "Banyak Kelompok", explanation: "Ada 4 wadah/kelompok lingkaran." },
        { term: "×", role: "Tanda Kali", explanation: "Menandakan pengelompokan yang berulang." },
        { term: "3", role: "Isi Tiap Kelompok", explanation: "Setiap wadah berisi 3 benda." },
        { term: "=", role: "Sama Dengan", explanation: "Menunjukkan total yang setara." },
        { term: "12", role: "Hasil Kali (Total)", explanation: "Total seluruh benda setelah digabungkan." },
      ],
      note: "Urutan konseptual: (Banyak Kelompok) × (Isi Tiap Kelompok). 4 kelompok berisi 3 benda ditulis 4 × 3 = 12.",
    },
    guidedPractice: {
      prompt: "Ada 3 wadah apel. Setiap wadah berisi 4 apel. Berapa jumlah seluruh apel?",
      a: 3,
      b: 4,
      answer: 12,
      hint: "Bayangkan 3 kelompok, masing-masing berisi 4: 4 + 4 + 4 = ?",
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
    conceptTitle: "Baris × Kolom",
    conceptExplanation: "Benda dapat disusun menjadi baris mendatar dan kolom tegak. 3 baris dengan 5 kolom menghasilkan total benda yang sama dengan 5 baris dengan 3 kolom.",
    exampleA: 3,
    exampleB: 5,
    strategy: "array",
    guidedPractice: {
      prompt: "Sebuah rak buku memiliki 2 baris. Setiap baris memuat 6 buku. Berapa total buku?",
      a: 2,
      b: 6,
      answer: 12,
      hint: "Hitung 2 baris × 6 kolom = ?",
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
    guidedPractice: {
      prompt: "Ada 5 kelereng biru dan 3 kelereng merah. Berapa jumlah seluruh kelereng?",
      a: 5,
      b: 3,
      answer: 8,
      hint: "Mulai dari 5, lalu hitung maju 3 langkah: 6, 7, 8.",
    },
  },
  {
    id: "add-make-ten",
    operation: "addition",
    title: "Strategi Menuju 10 (Make Ten)",
    subtitle: "Menguraikan bilangan agar membentuk puluhan utuh",
    description: "Strategi menjumlahkan dengan cara melengkapi bilangan pertama menjadi 10 terlebih dahulu.",
    prerequisites: ["add-up-to-10"],
    representations: ["ten-frame", "part-whole"],
    difficulty: 2,
    conceptTitle: "Bentuk 10 Terlebih Dahulu",
    conceptExplanation: "Ketika menjumlahkan angka seperti 8 + 7, lebih mudah mengambil 2 dari 7 agar 8 menjadi 10 utuh. Sisanya tinggal 5, sehingga 10 + 5 = 15.",
    exampleA: 8,
    exampleB: 7,
    strategy: "make-ten",
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
    representations: ["counters", "number-line"],
    difficulty: 1,
    conceptTitle: "Berapa yang Tersisa?",
    conceptExplanation: "Pengurangan terjadi ketika kita mengambil sebagian benda dari keseluruhan, atau mencari selisih antara dua kelompok.",
    exampleA: 7,
    exampleB: 3,
    strategy: "count-back",
    guidedPractice: {
      prompt: "Ada 8 kue di atas piring. Dimakan 3 kue. Berapa kue yang tersisa?",
      a: 8,
      b: 3,
      answer: 5,
      hint: "Mulai dari 8, hitung mundur 3 langkah: 7, 6, 5.",
    },
  },
  {
    id: "sub-bridge-ten",
    operation: "subtraction",
    title: "Pengurangan Melewati 10",
    subtitle: "Strategi mundur bertahap melalui angka 10",
    description: "Mengurangkan bilangan belasan dengan cara mengurangkan satuannya terlebih dahulu menuju 10.",
    prerequisites: ["sub-up-to-10"],
    representations: ["ten-frame", "number-line"],
    difficulty: 2,
    conceptTitle: "Singgah di Angka 10",
    conceptExplanation: "Untuk 13 - 5, kurangkan 3 terlebih dahulu agar sampai di 10. Lalu kurangkan sisa 2 dari 10, menghasilkan 8.",
    exampleA: 13,
    exampleB: 5,
    strategy: "bridge-ten",
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
    conceptExplanation: "Jika ada 12 permen dibagikan sama rata kepada 3 anak, setiap anak akan menerima 4 permen.",
    exampleA: 12,
    exampleB: 3,
    strategy: "sharing",
    guidedPractice: {
      prompt: "Ada 15 pensil warna yang dibagikan rata kepada 5 anak. Berapa pensil yang didapat setiap anak?",
      a: 15,
      b: 5,
      answer: 3,
      hint: "15 dibagi ke dalam 5 kelompok: 5 anak × ? pensil = 15 pensil?",
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
    conceptExplanation: "Ada 12 kue. Setiap kotak harus berisi 4 kue. Berapa kotak yang dibutuhkan? Kita memerlukan 3 kotak.",
    exampleA: 12,
    exampleB: 4,
    strategy: "grouping",
    guidedPractice: {
      prompt: "Ada 18 butir telur. Setiap wadah diisi 6 butir telur. Berapa wadah yang terisi penuh?",
      a: 18,
      b: 6,
      answer: 3,
      hint: "18 butir dikelompokkan per 6: 6, 12, 18. Jadi ada ? kelompok.",
    },
  },
  {
    id: "div-fact-families",
    operation: "division",
    title: "Keluarga Fakta (Fact Family)",
    subtitle: "Hubungan timbal balik antara perkalian dan pembagian",
    description: "Memahami bahwa pembagian adalah kebalikan langsung dari perkalian.",
    prerequisites: ["div-grouping"],
    representations: ["part-whole"],
    difficulty: 3,
    conceptTitle: "Perkalian dan Pembagian Saling Berhubungan",
    conceptExplanation: "Jika 4 × 3 = 12, maka secara otomatis 12 ÷ 3 = 4 dan 12 ÷ 4 = 3.",
    exampleA: 24,
    exampleB: 6,
    strategy: "multiplication-inverse",
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
