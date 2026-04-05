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
