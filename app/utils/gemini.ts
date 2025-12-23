import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default ai;

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.0-flash",
];

// Farklı SDK sürümlerini desteklemek için esnek arayüz
interface GeminiResponse {
  text?: string | (() => string);
  response?: {
    text?: string | (() => string);
  };
}

export async function generateGeminiContent(prompt: string): Promise<string> {
  let lastError: unknown;

  for (const modelName of MODELS) {
    try {
      const result = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      // Response'dan metni güvenli bir şekilde çıkar
      const text = extractTextFromResponse(result);

      const cleanText = text?.trim();
      if (cleanText) {
        return cleanText;
      }
    } catch (error) {
      console.warn(`Gemini Model Fallback - ${modelName} failed.`);
      if (error instanceof Error) {
        console.warn(`Error details for ${modelName}:`, error.message);
      }
      // Hata objesini detaylı yazdır (status code vb. görmek için)
      console.warn(error);

      lastError = error;
      // Sıradaki modele geç
    }
  }

  // Tüm denemeler başarısız olursa
  throw lastError || new Error("All AI models failed to generate content.");
}

// Helper: Yanıt objesinden metni çıkarmak için güvenli fonksiyon
function extractTextFromResponse(input: unknown): string | undefined {
  if (!input) return undefined;

  const result = input as GeminiResponse;

  // 1. Durum: .text() fonksiyonu varsa (Yaygın durum)
  if (typeof result.text === "function") {
    return result.text();
  }

  // 2. Durum: .text string özelliği varsa
  if (typeof result.text === "string") {
    return result.text;
  }

  // 3. Durum: response içinde response objesi varsa (Bazı SDK versiyonları)
  if (result.response) {
    if (typeof result.response.text === "function") {
      return result.response.text();
    }
    if (typeof result.response.text === "string") {
      return result.response.text;
    }
  }

  return undefined;
}
