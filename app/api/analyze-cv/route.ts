import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { generateGeminiContent } from "@/app/utils/gemini";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { AnalysisData } from "@/types";
import { addXP, XP_VALUES } from "@/app/utils/xp";
import { checkRateLimit } from "@/lib/rate-limit";

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

    // 1.5. Rate Limiting: Kullanıcı dakikada en fazla 10 CV analiz edebilir
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!dbUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const rateLimitResult = checkRateLimit(dbUser.id, 10); // Dakikada 10 istek
    if (!rateLimitResult.allowed) {
      const waitSeconds = Math.ceil(
        (rateLimitResult.resetTime - Date.now()) / 1000
      );
      return NextResponse.json(
        {
          error: `Çok fazla istek gönderdiniz. ${waitSeconds} saniye sonra tekrar deneyin.`,
          retryAfter: waitSeconds,
        },
        { status: 429 }
      );
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
      Sen, üst düzey bir İK uzmanı ve kariyer danışmanısın. Aşağıdaki CV metnini analiz et ve aşağıdaki JSON formatında detaylı bir rapor oluştur.

      İSTENEN ÇIKTI FORMATI:
      {
        "summary": "CV'yi 3 cümlede özetle. Adayın ana odak noktası ne?",
        "keywords": ["En güçlü 5 teknik yetenek (örnek: React, SQL)"],
        "suggestion": "Kariyer gelişimi için 1 somut öneri",
        "score": 0, // 0-100 arası genel CV puanı
        "details": {
          "impact": 0, // 0-100: Etki Odaklılık (Başarıların somutluğu)
          "brevity": 0, // 0-100: Kısalık ve Özgünlük
          "ats": 0, // 0-100: ATS (Aday Takip Sistemi) Uyumu
          "style": 0 // 0-100: Dil Bilgisi ve Yazım Tarzı
        }
      }

      CV METNİ: """${rawText}"""
      
      Sadece bu JSON objesini döndür. Başka hiçbir açıklama yapma.
    `;

    // 4. Gemini AI servisine isteği gönder (Fallback Mekanizması ile)
    // generateGeminiContent artık doğrudan string döndürüyor.
    const text = await generateGeminiContent(prompt);

    // AI yanıtı boşsa hata fırlat.
    if (!text) {
      throw new Error("AI yanıtı boş.");
    }

    // 5. JSON yanıtını temizle ve parse et (Markdown bloklarını kaldır)
    const cleanJson = text.replace(/```json|```/g, "").trim();

    let parsedData: AnalysisData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      return NextResponse.json(
        { error: "AI yanıtı işlenemedi." },
        { status: 500 }
      );
    }

    // Default değerler ata eğer AI eksik döndürürse
    const {
      summary,
      keywords,
      suggestion,
      score = 0,
      details = { impact: 0, brevity: 0, ats: 0, style: 0 },
    } = parsedData;

    // 6. Sonuçları Veritabanına Kaydet
    await prisma.cVAnalysis.create({
      data: {
        cvId,
        title: title ?? null,
        summary: summary || "",
        keywords: Array.isArray(keywords) ? keywords.map(String) : [],
        suggestion: suggestion || "",
        score,
        impact: details.impact,
        brevity: details.brevity,
        ats: details.ats,
        style: details.style,
      },
    });

    // Kullanıcıya XP ekle (+25 CV analizi bonusu)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
      await addXP(user.id, XP_VALUES.CV_ANALYSIS);
    }

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

    let errorMessage = "İşlem sırasında bir hata oluştu.";
    let statusCode = 500;

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (
        msg.includes("resource exhausted") ||
        msg.includes("quota") ||
        msg.includes("429")
      ) {
        errorMessage =
          "Servis şu an çok yoğun. Lütfen 1-2 dakika bekleyip tekrar deneyin.";
        statusCode = 429;
      } else if (msg.includes("candidate block") || msg.includes("safety")) {
        errorMessage = "İçerik güvenlik politikaları nedeniyle işlenemedi.";
        statusCode = 400;
      } else if (msg.includes("not found") || msg.includes("404")) {
        errorMessage =
          "Analiz servisine şu an erişilemiyor. Lütfen daha sonra tekrar deneyin.";
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
