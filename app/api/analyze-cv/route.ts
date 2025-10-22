import { NextRequest, NextResponse } from "next/server";
import ai from "@/app/utils/gemini";

export async function POST(request: NextRequest) {
  try {
    const { rawText, title } = await request.json();

    if (!rawText) {
      return NextResponse.json({ error: "CV metni boş." }, { status: 400 });
    }

    const prompt = `
      Sen, üst düzey bir İK uzmanı ve kariyer danışmanısın. Aşağıdaki CV metnini 3 aşamalı olarak analiz et:

      1. ÖZET: CV'yi 3 cümlede özetle. Adayın ana odak noktası (Frontend, Backend, vs.) ne?
      2. ANAHTAR KELİMELER: CV'deki en güçlü 5 teknik beceriyi (örnek: React, SQL, Cloud) bir JSON dizisi olarak çıkar.
      3. GELİŞİM ÖNERİSİ: Adayın kariyer hedefi göz önüne alındığında, eksik olduğu 2 alanı ve bu eksikliği gidermesi için somut 1 öneri yaz.

      CV METNİ: """${rawText}"""

      Cevabını, başka hiçbir metin eklemeden, sadece bu JSON formatında döndür:
      {
        "summary": "...",
        "keywords": ["...", "..."],
        "suggestion": "..."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    if (!response.text) {
      return NextResponse.json(
        {
          error:
            "Gemini analiz verisi üretemedi. Lütfen CV içeriğini kontrol edin.",
        },
        { status: 500 }
      );
    }

    const jsonString = response.text
      .trim()
      .replace(/```json|```/g, "")
      .trim();
    const analysisResult = JSON.parse(jsonString);
    return NextResponse.json(
      {
        success: true,
        title: title,
        analysis: analysisResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gemini Analiz Hatası:", error);
    return NextResponse.json(
      { error: "AI Analizi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
