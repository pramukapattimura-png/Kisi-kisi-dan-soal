import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Data is required" });

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing in server environment");
    
    const ai = new GoogleGenAI({ apiKey });
    
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

    return res.status(200).json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Vercel Generation Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
