import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { AppData, GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function checkApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API_KEY_MISSING: Gemini API Key tidak ditemukan. Jika Anda menggunakan Vercel, pastikan Anda telah menambahkan GEMINI_API_KEY di Environment Variables.");
  }
}

export async function generateSoalAndKisi(data: AppData): Promise<GeneratedContent> {
  checkApiKey();
  let prompt = `
    Anda adalah seorang pakar pendidikan Madrasah Ibtidaiyah (MI) di Indonesia.
    Buatkan Kisi-kisi, Soal, dan Kunci Jawaban berdasarkan data berikut:
    
    Satuan Pendidikan: ${data.namaSatuanPendidikan}
    Jenis Asesmen: ${data.jenisAsesmen}
    Mata Pelajaran: ${data.mapel}
    Fase: ${data.fase}
    Kelas: ${data.kelas}
    Tahun Pelajaran: ${data.tahunPelajaran}
`;

  if (data.inputMethod === 'manual') {
    prompt += `
    Capaian Pembelajaran (CP): ${data.cp}
    Tujuan Pembelajaran (TP): ${data.tp}
    Materi Esensial: ${data.materiEsensial}
    `;
  } else {
    prompt += `
    ACUAN UTAMA: Gunakan file PDF yang dilampirkan sebagai kisi-kisi acuan untuk membuat soal.
    Ekstrak indikator, materi, dan tujuan pembelajaran dari PDF tersebut.
    `;
    
    if (data.kisiKisiRows && data.kisiKisiRows.length > 0) {
      prompt += `
      DATA KISI-KISI TERDETEKSI (Gunakan data ini sebagai referensi utama):
      ${JSON.stringify(data.kisiKisiRows, null, 2)}
      `;
    }
  }

  prompt += `
    Jumlah Soal:
    - Pilihan Ganda (PG): ${data.jumlahPG}
    - Isian: ${data.jumlahIsian}
    - Uraian: ${data.jumlahUraian}
    
    Distribusi Level Kognitif:
    - L1 (C1, C2): ${data.persenL1}%
    - L2 (C3, C4): ${data.persenL2}%
    - L3 (C5, C6): ${data.persenL3}%
    
    Instruksi Khusus:
    1. Indikator soal harus mengacu pada Tujuan Pembelajaran (TP) atau kisi-kisi yang diberikan.
    2. Level Kognitif harus sesuai dengan persentase yang diminta.
    3. Untuk setiap soal Pilihan Ganda (PG), WAJIB sertakan 4 opsi jawaban (a, b, c, d).
    4. JANGAN sertakan huruf alfabet (a, b, c, d) di dalam teks opsi jawaban, karena sistem akan menambahkannya secara otomatis. Contoh: cukup tulis "Matahari" bukan "a. Matahari".
    5. Kunci jawaban untuk soal PG harus berupa huruf (a, b, c, atau d).
    6. Untuk setiap soal, sertakan prompt generate gambar jika diperlukan untuk memperjelas soal.
    7. Format output harus JSON sesuai schema.
    8. Bahasa yang digunakan adalah Bahasa Indonesia yang baik dan benar sesuai Ejaan Bahasa Indonesia.
  `;

  const contents: any[] = [];
  
  if (data.inputMethod === 'pdf' && data.pdfData) {
    contents.push({
      inlineData: {
        mimeType: "application/pdf",
        data: data.pdfData
      }
    });
  }
  
  contents.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          kisiKisi: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                no: { type: Type.INTEGER },
                fase: { type: Type.STRING },
                cp: { type: Type.STRING },
                materiEsensial: { type: Type.STRING },
                indikator: { type: Type.STRING },
                levelKognitif: { type: Type.STRING },
                noSoal: { type: Type.STRING },
                bentukSoal: { type: Type.STRING },
              },
              required: ["no", "fase", "cp", "materiEsensial", "indikator", "levelKognitif", "noSoal", "bentukSoal"],
            },
          },
          soal: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                no: { type: Type.INTEGER },
                tipe: {
                  type: Type.STRING,
                  enum: ["PG", "Isian", "Uraian"],
                },
                pertanyaan: { type: Type.STRING },
                opsi: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Wajib diisi jika tipe adalah PG. Berisi 4 opsi jawaban.",
                },
                promptGambar: { type: Type.STRING },
              },
              required: ["no", "tipe", "pertanyaan"],
            },
          },
          kunciJawaban: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                no: { type: Type.INTEGER },
                jawaban: { type: Type.STRING },
              },
              required: ["no", "jawaban"],
            },
          },
        },
        required: ["kisiKisi", "soal", "kunciJawaban"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as GeneratedContent;
}

export interface PdfAnalysis {
  jumlahPG: number;
  jumlahIsian: number;
  jumlahUraian: number;
  persenL1: number;
  persenL2: number;
  persenL3: number;
  rows?: any[]; // The extracted table rows
}

export async function analyzePdfKisiKisi(pdfBase64: string): Promise<PdfAnalysis> {
  checkApiKey();
  const prompt = `
    Tugas Anda adalah mengekstrak data statistik DAN tabel kisi-kisi dari file PDF kisi-kisi soal Madrasah/Sekolah.
    Analisa seluruh halaman PDF dan cari informasi berikut:
    
    1. DATA STATISTIK:
       - Jumlah soal Pilihan Ganda (PG)
       - Jumlah soal Isian (Isian Singkat)
       - Jumlah soal Uraian (Essay)
       - Persentase Level Kognitif L1 (Pengetahuan/Pemahaman - C1, C2)
       - Persentase Level Kognitif L2 (Aplikasi - C3, C4)
       - Persentase Level Kognitif L3 (Penalaran/HOTS - C5, C6)

    2. TABEL KISI-KISI (Ekstrak semua baris tabel yang relevan):
       - no: Nomor urut
       - fase: Fase (A, B, atau C)
       - cp: Capaian Pembelajaran
       - materiEsensial: Materi Esensial
       - indikator: Indikator Soal
       - levelKognitif: Level Kognitif (L1, L2, atau L3)
       - noSoal: Nomor Soal
       - bentukSoal: Bentuk Soal (PG, Isian, atau Uraian)

    Aturan Ekstraksi:
    - Cari tabel yang memiliki kolom "Bentuk Soal", "No Soal", atau "Level Kognitif".
    - ACUAN UTAMA JUMLAH SOAL: Jika jumlah soal tidak tertulis secara eksplisit sebagai total, gunakan jumlah baris indikator (rows) yang ditemukan sebagai acuan utama banyaknya soal.
    - Hitunglah jumlah kemunculan nomor soal atau baris untuk setiap kategori (PG, Isian, Uraian). Pastikan total jumlahPG + jumlahIsian + jumlahUraian sama dengan jumlah baris di tabel rows.
    - Jika persentase level kognitif tidak disebutkan, lakukan estimasi berdasarkan indikator soal atau kata kerja operasional yang digunakan.
    - Pastikan total persenL1 + persenL2 + persenL3 = 100.
    - Ekstrak SETIAP baris dari tabel kisi-kisi yang ada di PDF. Jika kolom CP atau Fase kosong di PDF, isilah berdasarkan konteks baris sebelumnya.
    - Jika data benar-benar tidak ditemukan, gunakan nilai 0 untuk jumlah soal dan distribusi default (L1:30, L2:50, L3:20).

    Format output WAJIB JSON murni:
    {
      "jumlahPG": number,
      "jumlahIsian": number,
      "jumlahUraian": number,
      "persenL1": number,
      "persenL2": number,
      "persenL3": number,
      "rows": [
        {
          "no": number,
          "fase": string,
          "cp": string,
          "materiEsensial": string,
          "indikator": string,
          "levelKognitif": string,
          "noSoal": string,
          "bentukSoal": string
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBase64
          }
        },
        { text: prompt }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jumlahPG: { type: Type.INTEGER },
            jumlahIsian: { type: Type.INTEGER },
            jumlahUraian: { type: Type.INTEGER },
            persenL1: { type: Type.INTEGER },
            persenL2: { type: Type.INTEGER },
            persenL3: { type: Type.INTEGER },
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  no: { type: Type.INTEGER },
                  fase: { type: Type.STRING },
                  cp: { type: Type.STRING },
                  materiEsensial: { type: Type.STRING },
                  indikator: { type: Type.STRING },
                  levelKognitif: { type: Type.STRING },
                  noSoal: { type: Type.STRING },
                  bentukSoal: { type: Type.STRING }
                },
                required: ["no", "fase", "cp", "materiEsensial", "indikator", "levelKognitif", "noSoal", "bentukSoal"]
              }
            }
          },
          required: ["jumlahPG", "jumlahIsian", "jumlahUraian", "persenL1", "persenL2", "persenL3", "rows"]
        }
      }
    });

    const text = response.text;
    console.log("PDF Analysis Raw Output:", text);
    const result = JSON.parse(text || "{}");
    
    return {
      jumlahPG: typeof result.jumlahPG === 'number' ? result.jumlahPG : 0,
      jumlahIsian: typeof result.jumlahIsian === 'number' ? result.jumlahIsian : 0,
      jumlahUraian: typeof result.jumlahUraian === 'number' ? result.jumlahUraian : 0,
      persenL1: typeof result.persenL1 === 'number' ? result.persenL1 : 30,
      persenL2: typeof result.persenL2 === 'number' ? result.persenL2 : 50,
      persenL3: typeof result.persenL3 === 'number' ? result.persenL3 : 20,
      rows: Array.isArray(result.rows) ? result.rows : []
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      jumlahPG: 0,
      jumlahIsian: 0,
      jumlahUraian: 0,
      persenL1: 30,
      persenL2: 50,
      persenL3: 20
    };
  }
}
