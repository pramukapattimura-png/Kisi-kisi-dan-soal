export interface AppData {
  // Step 1: Identity
  namaSatuanPendidikan: string;
  namaGuru: string;
  nipGuru: string;
  namaKepalaMadrasah: string;
  nipKepalaMadrasah: string;
  jenisAsesmen: string;
  
  // Step 2: Main Input
  fase: "A" | "B" | "C";
  kelas: string;
  mapel: string;
  tahunPelajaran: string;
  inputMethod: 'manual' | 'pdf';
  pdfData: string | null; // Base64 string of the PDF
  cp: string;
  tp: string;
  materiEsensial: string;
  jumlahPG: number;
  jumlahIsian: number;
  jumlahUraian: number;
  persenL1: number;
  persenL2: number;
  persenL3: number;
}

export interface GeneratedContent {
  kisiKisi: KisiKisiRow[];
  soal: SoalItem[];
  kunciJawaban: KunciJawabanItem[];
}

export interface KisiKisiRow {
  no: number;
  fase: string;
  cp: string;
  materiEsensial: string;
  indikator: string;
  levelKognitif: string;
  noSoal: string;
  bentukSoal: string;
  insersiKBC: string;
}

export interface SoalItem {
  no: number;
  tipe: "PG" | "Isian" | "Uraian";
  pertanyaan: string;
  opsi?: string[]; // For PG
  promptGambar?: string;
  insersiKBC: string;
}

export interface KunciJawabanItem {
  no: number;
  jawaban: string;
}
