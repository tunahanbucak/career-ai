import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import ai from "@/app/utils/gemini";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { AnalysisResult } from "@/types";

// Zod şeması: Gelen istek verilerinin doğrulanması için kullanılır.
const analyzeCvSchema = z.object({
  rawText: z.string().min(1, "CV metni boş olamaz."), // CV içeriği zorunludur.
  title: z.string().optional(), // Başlık opsiyoneldir.
  cvId: z.string().min(1, "cvId gereklidir."), // Hangi CV'nin analiz edildiği bilinmelidir.
});

// POST Metodu: CV analizi işlemini gerçekleştirir.
export async function POST(request: NextRequest) {
  try {
    // 1. Kullanıcı oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      // Oturum açmamış kullanıcıya yetkisiz hatası dön.
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    // 2. İstek verisini al ve doğrula
    const json = await request.json();
    const result = analyzeCvSchema.safeParse(json);

    // Eğer veri doğrulama hatası varsa 400 hatası dön.
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Geçersiz veri." },
        { status: 400 }
      );
    }

    const { rawText, title, cvId } = result.data;

    // 3. Yapay Zeka (Gemini) için prompt hazırlığı
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

    // 4. Gemini AI servisine isteği gönder
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // En hızlı ve güncel modeli kullanır.
      contents: prompt,
    });

    const text = response.text ? response.text.trim() : "";

    // AI yanıtı boşsa hata fırlat.
    if (!text) {
      throw new Error("AI yanıtı boş.");
    }

    // 5. JSON yanıtını temizle ve parse et (Markdown bloklarını kaldır)
    const cleanJson = text.replace(/```json|```/g, "").trim();

    let parsedData: AnalysisResult;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      return NextResponse.json(
        { error: "AI yanıtı işlenemedi." },
        { status: 500 }
      );
    }

    const { summary, keywords, suggestion } = parsedData;

    // 6. Sonuçları Veritabanına Kaydet
    await prisma.cVAnalysis.create({
      data: {
        cvId,
        title: title ?? null,
        summary: summary || "",
        keywords: Array.isArray(keywords) ? keywords.map(String) : [],
        suggestion: suggestion || "",
      },
    });

    // 7. Başarılı yanıtı döndür
    return NextResponse.json(
      {
        success: true,
        title,
        analysis: parsedData,
        cvId,
      },
      { status: 200 }
    );
  } catch (error) {
    // Beklenmedik hataları yakala ve logla
    console.error("Analyze CV API Error:", error);
    return NextResponse.json(
      { error: "İşlem sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
