import { AppData, GeneratedContent } from "../types";

export async function generateSoalAndKisi(data: AppData): Promise<GeneratedContent> {
  const response = await fetch("/api/generate-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.error?.includes("GEMINI_API_KEY")) {
      throw new Error("API_KEY_MISSING: Gemini API Key tidak ditemukan di server.");
    }
    throw new Error(errorData.error || "Gagal menghasilkan konten");
  }

  return await response.json();
}

export interface PdfAnalysis {
  jumlahPG: number;
  jumlahIsian: number;
  jumlahUraian: number;
  persenL1: number;
  persenL2: number;
  persenL3: number;
  rows?: any[];
}

export async function analyzePdfKisiKisi(pdfBase64: string): Promise<PdfAnalysis> {
  try {
    const response = await fetch("/api/analyze-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfBase64 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error?.includes("GEMINI_API_KEY")) {
        throw new Error("API_KEY_MISSING: Gemini API Key tidak ditemukan di server.");
      }
      throw new Error(errorData.error || "Gagal menganalisa PDF");
    }

    const result = await response.json();
    
    return {
      jumlahPG: typeof result.jumlahPG === 'number' ? result.jumlahPG : 0,
      jumlahIsian: typeof result.jumlahIsian === 'number' ? result.jumlahIsian : 0,
      jumlahUraian: typeof result.jumlahUraian === 'number' ? result.jumlahUraian : 0,
      persenL1: typeof result.persenL1 === 'number' ? result.persenL1 : 30,
      persenL2: typeof result.persenL2 === 'number' ? result.persenL2 : 50,
      persenL3: typeof result.persenL3 === 'number' ? result.persenL3 : 20,
      rows: Array.isArray(result.rows) ? result.rows : []
    };
  } catch (error: any) {
    console.error("Analysis Error:", error);
    if (error.message?.includes("API_KEY_MISSING")) {
      throw error;
    }
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
