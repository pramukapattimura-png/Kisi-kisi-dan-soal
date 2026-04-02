import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { pdfBase64 } = req.body;
    if (!pdfBase64) return res.status(400).json({ error: "PDF data is required" });

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing in server environment");
    
    const ai = new GoogleGenAI({ apiKey });
    
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

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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

    return res.status(200).json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Vercel PDF Analysis Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
