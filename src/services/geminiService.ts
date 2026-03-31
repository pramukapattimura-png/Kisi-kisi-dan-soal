import { GoogleGenAI, Type } from "@google/genai";
import { AppData, GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateSoalAndKisi(data: AppData): Promise<GeneratedContent> {
  const prompt = `
    Anda adalah seorang pakar pendidikan Madrasah Ibtidaiyah (MI) di Indonesia.
    Buatkan Kisi-kisi, Soal, dan Kunci Jawaban berdasarkan data berikut:
    
    Satuan Pendidikan: ${data.namaSatuanPendidikan}
    Mata Pelajaran: ${data.mapel}
    Fase: ${data.fase}
    Kelas: ${data.kelas}
    Semester: ${data.semester}
    Tahun Pelajaran: ${data.tahunPelajaran}
    Capaian Pembelajaran (CP): ${data.cp}
    Tujuan Pembelajaran (TP): ${data.tp}
    Materi Esensial: ${data.materiEsensial}
    
    Jumlah Soal:
    - Pilihan Ganda (PG): ${data.jumlahPG}
    - Isian: ${data.jumlahIsian}
    - Uraian: ${data.jumlahUraian}
    
    Distribusi Level Kognitif:
    - L1 (C1, C2): ${data.persenL1}%
    - L2 (C3, C4): ${data.persenL2}%
    - L3 (C5, C6): ${data.persenL3}%
    
    Instruksi Khusus:
    1. Indikator soal harus mengacu pada Tujuan Pembelajaran (TP).
    2. Level Kognitif harus sesuai dengan persentase yang diminta.
    3. Untuk setiap soal Pilihan Ganda (PG), WAJIB sertakan 4 opsi jawaban (a, b, c, d).
    4. JANGAN sertakan huruf alfabet (a, b, c, d) di dalam teks opsi jawaban, karena sistem akan menambahkannya secara otomatis. Contoh: cukup tulis "Matahari" bukan "a. Matahari".
    5. Kunci jawaban untuk soal PG harus berupa huruf (a, b, c, atau d).
    6. Untuk setiap soal, sertakan prompt generate gambar jika diperlukan untuk memperjelas soal.
    7. Format output harus JSON sesuai schema.
    8. Bahasa yang digunakan adalah Bahasa Indonesia yang baik dan benar sesuai Ejaan Bahasa Indonesia.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
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
