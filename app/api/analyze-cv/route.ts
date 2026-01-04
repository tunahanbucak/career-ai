import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { generateGeminiContent } from "@/app/utils/gemini";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { AnalysisData, AnalysisDetails } from "@/types";
import { addXP, XP_VALUES } from "@/app/utils/xp";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";

// Zod şeması: Gelen istek verilerinin doğrulanması için kullanılır.
const analyzeCvSchema = z.object({
  rawText: z.string().min(1, "CV metni boş olamaz."), // CV içeriği zorunludur.
  title: z.string().optional(), // Başlık opsiyoneldir.
  cvId: z.string().min(1, "cvId gereklidir."), // Hangi CV'nin analiz edildiği bilinmelidir.
  recaptchaToken: z.string().optional(), // Güvenlik doğrulaması (v3)
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

    const { rawText, title, cvId, recaptchaToken } = result.data;

    // 2.5 reCAPTCHA Doğrulaması
    if (recaptchaToken) {
      const isValid = await verifyRecaptcha(recaptchaToken);
      if (!isValid) {
        return NextResponse.json(
          { error: "Güvenlik doğrulaması başarısız oldu." },
          { status: 400 }
        );
      }
    }

    // İçeriğin SHA-256 özetini (hash) oluştur
    const contentHash = await crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(rawText))
      .then((hash) =>
        Array.from(new Uint8Array(hash))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      );

    // Veritabanında aynı hash'e sahip analiz var mı?
    // Analysis model adı şemada CVAnalysis olarak geçiyor
    const existingAnalysis = await prisma.cVAnalysis.findFirst({
      where: {
        contentHash: contentHash,
        // Sadece geçerli, tamamlanmış analizleri kabul et
        score: { gt: 0 },
        summary: { not: "" },
      },
      orderBy: { createdAt: "desc" }, // En son analizi getir
    });

    // CACHE HIT KONTROLÜ: AKTİF
    if (existingAnalysis) {
      console.log(
        `CACHE HIT: Mevcut analiz döndürülüyor (Score: ${existingAnalysis.score})`
      );

      // Tüm detayları eksiksiz döndür
      const cachedData: AnalysisData = {
        summary: existingAnalysis.summary,
        keywords: existingAnalysis.keywords,
        suggestion: existingAnalysis.suggestion,
        score: existingAnalysis.score || 0,
        details: {
          impact: existingAnalysis.impact || 0,
          brevity: existingAnalysis.brevity || 0,
          ats: existingAnalysis.ats || 0,
          style: existingAnalysis.style || 0,
        },
      };

      await prisma.cVAnalysis.create({
        data: {
          cvId,
          title: title ?? existingAnalysis.title, // Yeni başlık veya eskisi
          summary: existingAnalysis.summary,
          keywords: existingAnalysis.keywords,
          suggestion: existingAnalysis.suggestion,
          score: existingAnalysis.score,
          impact: existingAnalysis.impact,
          brevity: existingAnalysis.brevity,
          ats: existingAnalysis.ats,
          style: existingAnalysis.style,
          contentHash,
        },
      });

      return NextResponse.json(
        {
          success: true,
          title: title ?? existingAnalysis.title,
          analysis: cachedData,
          cvId,
          levelUp: false, // Cache'den gelince level atlatmayalım (spam önleme)
          newLevel: 0,
          levelName: "",
          isCached: true,
        },
        { status: 200 }
      );
    } else {
      console.log("CACHE MISS: Yeni analiz yapılıyor...");
    }

    // 3. Yapay Zeka (Gemini) için prompt hazırlığı
    const today = new Date().toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const systemInstruction = `
      Sen, Google veya Microsoft standartlarında çalışan, ancak 'Geliştirici ve Yardımsever' odaklı bir Kıdemli Teknik İşe Alım Yöneticisisin.
      Amacın adayı yerin dibine sokmak değil, ona eksiklerini gösterip yukarı taşımaktır.
      
      BUGÜNÜN TARİHİ: ${today}. (Tarihleri buna göre kontrol et, 2024 geçmişte kaldı.)
      
      KURALLAR:
      1. GENEL PUANLAMA: Acımasız olma. Adil ama motive edici ol. (İyi bir CV için 65-85 arası idealdir).
      2. DETAY PUANLARI: Lütfen 'impact', 'brevity' gibi alt puanları GENEL SKOR ile uyumlu ver. (Örn: Genel skor 70 ise, detaylar 60-85 bandında olmalı. ASLA 0-10 gibi komik düşük puanlar verme).
      3. ÜSLUP: Profesyonel, kurumsal ve ZENGİN bir dil kullan. Kısa kesip atma.
      4. İÇERİK: Özet ve Tavsiye kısımları "dolu dolu" olmalı. Okuyan kişi "Vay be, gerçekten incelemiş" demeli.

      YANIT FORMATIN SADECE JSON OLMALIDIR.
    `;

    const prompt = `
      Aşağıdaki CV metnini analiz et ve JSON formatında rapor oluştur.
      
      İSTENEN ÇIKTI:
      {
        "summary": "Adayın yetkinliklerini, deneyim seviyesini ve potansiyelini analiz eden, 3-4 cümlelik, KAPSAMLI ve PROFESYONEL bir özet. (Sadece 'iyi aday' deme, neden iyi olduğunu teknik terimlerle anlat).",
        "keywords": ["En güçlü 5 teknik yetenek"],
        "suggestion": "Adayın CV'sini bir üst seviyeye taşıyacak, detaylı ve uygulanabilir bir tavsiye. (Örn: Sadece 'Proje ekle' deme. 'Github profili zayıf duruyor; özellikle React ve Next.js içeren, Deployment'ı yapılmış 2 adet Full-Stack proje ekleyerek bu açığı kapatmalısın' gibi YOL GÖSTERİCİ ol).",
        "score": 0, // 0-100 arası genel puan (Örn: 72)
        "details": {
          "impact": 0, // 0-100 arası puan (Genel skora yakın)
          "brevity": 0, // 0-100 arası puan (Genel skora yakın)
          "ats": 0, // 0-100 arası puan (Genel skora yakın)
          "style": 0 // 0-100 arası puan (Genel skora yakın)
        }
      }

      CV METNİ: """${rawText}"""
    `;

    // 4. Gemini AI servisine isteği gönder (Fallback Mekanizması ve System Instruction ile)
    const text = await generateGeminiContent(prompt, systemInstruction);

    // AI yanıtı boşsa hata fırlat.
    if (!text) {
      throw new Error("AI yanıtı boş.");
    }

    // 5. JSON yanıtını temizle ve parse et (Daha güvenli regex)
    console.log("Raw AI Response:", text);

    let parsedData: AnalysisData;
    try {
      // Markdown bloklarını temizle
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch
        ? jsonMatch[0]
        : text.replace(/```json|```/g, "").trim();

      parsedData = JSON.parse(cleanJson);
      console.log("Parsed Data Success:", parsedData.score);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      console.log("Failed JSON Content:", text); // Hatalı içeriği gör
      return NextResponse.json(
        { error: "AI yanıtı işlenemedi." },
        { status: 500 }
      );
    }

    // Default değerler ata (Güvenli Destructuring)
    const summary = parsedData.summary || "";
    const keywords = parsedData.keywords || [];
    const suggestion = parsedData.suggestion || "";
    const score = parsedData.score || 0;

    // Details objesini güvenli bir şekilde oluştur
    const rawDetails = (parsedData.details || {}) as AnalysisDetails;
    const details = {
      impact: rawDetails.impact ?? 0,
      brevity: rawDetails.brevity ?? 0,
      ats: rawDetails.ats ?? 0,
      style: rawDetails.style ?? 0,
    };

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
        contentHash, // Caching için hash'i kaydet
      },
    });

    // Kullanıcıya XP ekle (+25 CV analizi bonusu) ve Level kontrolü yap
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    let levelUpData = { levelUp: false, newLevel: 0, levelName: "" };

    if (user) {
      const oldLevel = user.level;
      await addXP(user.id, XP_VALUES.CV_ANALYSIS);

      // Güncel kullanıcı verisini tekrar çek
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (updatedUser && updatedUser.level > oldLevel) {
        levelUpData = {
          levelUp: true,
          newLevel: updatedUser.level,
          levelName: updatedUser.levelName,
        };
      }
    }

    // 7. Başarılı yanıtı döndür
    return NextResponse.json(
      {
        success: true,
        title,
        analysis: parsedData,
        cvId,
        levelUp: levelUpData.levelUp,
        newLevel: levelUpData.newLevel,
        levelName: levelUpData.levelName,
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
