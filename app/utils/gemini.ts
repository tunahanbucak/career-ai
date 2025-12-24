import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.0-flash",
];

/**
 * Gemini AI içeriği üretir.
 * @param prompt Kullanıcı mesajı
 * @param systemInstruction Sistem talimatı (opsiyonel)
 * @returns Üretilen metin
 */
export async function generateGeminiContent(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  let lastError: unknown;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
        generationConfig: {
          temperature: 0.3, // Daha tutarlı sonuçlar için düşük sıcaklık
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text?.trim();
      if (cleanText) {
        return cleanText;
      }
    } catch (error) {
      console.warn(`Gemini Model Fallback - ${modelName} failed.`);
      if (error instanceof Error) {
        console.warn(`Error details for ${modelName}:`, error.message);
      }
      lastError = error;
    }
  }

  throw lastError || new Error("All AI models failed to generate content.");
}

/**
 * Gemini AI içeriği üretir (Streaming)
 * @param prompt Kullanıcı mesajı
 * @param systemInstruction Sistem talimatı (opsiyonel)
 * @returns AsyncGenerator - içerik parçalarını döner
 */
export async function* streamGeminiContent(
  prompt: string,
  systemInstruction?: string
) {
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
      });

      const result = await model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield chunkText;
        }
      }
      return; // Başarılı olursa döngüden çık
    } catch (error) {
      console.warn(`Gemini Streaming Fallback - ${modelName} failed.`);
      // Sıradaki modele geç
    }
  }
}

/**
 * Yanıt objesinden metni çıkarmak için güvenli yardımcı fonksiyon.
 */
export function extractTextFromResponse(input: any): string | undefined {
  if (!input) return undefined;
  try {
    if (typeof input.text === "function") return input.text();
    if (typeof input.response?.text === "function") return input.response.text();
    return input.text || input.response?.text;
  } catch (e) {
    return undefined;
  }
}
