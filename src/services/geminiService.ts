import { AppData, GeneratedContent } from "../types";

export async function generateSoalAndKisi(data: AppData): Promise<GeneratedContent> {
  const response = await fetch("/api/generate-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseText);
      throw new Error(errorData.error || "Gagal menghasilkan konten");
    } catch (e) {
      throw new Error(`Server Error (${response.status}): ${responseText.substring(0, 100)}...`);
    }
  }

  try {
    return JSON.parse(responseText);
  } catch (e) {
    throw new Error("Gagal memproses data dari server. Silakan coba lagi.");
  }
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

    const responseText = await response.text();

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || "Gagal menganalisa PDF");
      } catch (e) {
        throw new Error(`Server Error (${response.status}): ${responseText.substring(0, 100)}...`);
      }
    }

    const result = JSON.parse(responseText);
    
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
    throw error;
  }
}
