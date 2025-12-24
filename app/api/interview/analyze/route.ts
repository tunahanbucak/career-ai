import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { generateGeminiContent } from "@/app/utils/gemini";
import { addXP, XP_VALUES } from "@/app/utils/xp";

// POST: Mülakat analizi oluştur
export async function POST(request: NextRequest) {
  try {
    // 1. Oturum Kontrolü
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    // 2. İstek Verilerini Okuma
    const { interviewId } = await request.json();

    if (!interviewId) {
      return NextResponse.json(
        { error: "interviewId gerekli." },
        { status: 400 }
      );
    }

    // 3. Kullanıcıyı Bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    // 4. Mülakatı ve Mesajları Çek
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            role: true,
            content: true,
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Mülakat bulunamadı." },
        { status: 404 }
      );
    }

    // 5. Kullanıcının mülakatı olduğundan emin ol
    if (interview.userId !== user.id) {
      return NextResponse.json(
        { error: "Bu mülakat size ait değil." },
        { status: 403 }
      );
    }

    // 6. Zaten analiz edilmişse hata dön
    if (interview.isCompleted) {
      return NextResponse.json(
        { error: "Bu mülakat zaten analiz edilmiş." },
        { status: 400 }
      );
    }

    // 7. Minimum mesaj kontrolü (en az 5 mesaj değişimi = 10 mesaj)
    if (interview.messages.length < 10) {
      return NextResponse.json(
        { error: "Analiz için en az 5 soru-cevap gerekli." },
        { status: 400 }
      );
    }

    // 8. Mülakat geçmişini metne çevir
    const conversationText = interview.messages
      .map((msg) => {
        const role = msg.role === "ASSISTANT" ? "Mülakatçı" : "Aday";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n");

    // 9. AI Analiz Prompt'u Hazırla
    const systemInstruction = `
      Sen deneyimli bir İK uzmanı ve teknik mülakat değerlendiricisisin.
      Görevin, mülakat konuşmasını derinlemesine analiz ederek adaya DETAYLI ve YAPILANDIRICI geri bildirim sunmaktır.
      
      ÖNEMLI KURALLAR:
      1. Genel ve belirsiz ifadeler KULLANMA ("iyi", "orta", "geliştirilmeli" gibi)
      2. SOMUT ÖRNEKLER ver (konuşmadan alıntılar yap)
      3. SAYISAL değerlendirmeler yap (1-10 skalası)
      4. EYLEM ÖNERİLERİ sun (ne yapmalı, nasıl gelişmeli)
      5. SADECE JSON formatında yanıt ver, başka açıklama yapma
      
      JSON YAPISI:
      {
        "score": 0-100 arası sayı (objektif değerlendirme),
        "summary": "2-3 cümlelik DETAYLI genel değerlendirme. Adayın en güçlü ve en zayıf yönlerini SOMUT olarak belirt.",
        "strengths": ["Somut güçlü yön 1", "Somut güçlü yön 2", "Somut güçlü yön 3"],
        "improvements": ["Spesifik gelişim alanı 1", "Spesifik gelişim alanı 2", "Spesifik gelişim alanı 3"],
        "culturalFit": "2-3 cümlelik DETAYLI kültürel uyum analizi. Adayın iletişim tarzı, motivasyonu, takım çalışmasına yatkınlığı hakkında SOMUT gözlemler.",
        "roadmap": [
          "Kısa vadeli eylem 1 (1 ay içinde yapılabilir)",
          "Orta vadeli eylem 2 (3 ay içinde)",
          "Uzun vadeli eylem 3 (6+ ay)",
          "Kaynak önerisi (kurs, kitap, proje)"
        ]
      }
      
      ÖRNEK YANIT (KÖTÜ - KULLANMA):
      {
        "summary": "Analiz tamamlandı.",
        "culturalFit": "Kültürel uyum analizi tamamlandı."
      }
      
      ÖRNEK YANIT (İYİ - KULLAN):
      {
        "summary": "Aday, React ve TypeScript konularında güçlü teknik bilgi sergiledi ancak state management ve performans optimizasyonu konularında eksiklikleri var. İletişim becerileri orta seviyede, bazı sorulara net yanıt vermekte zorlandı.",
        "culturalFit": "Aday, öğrenmeye açık ve gelişime istekli bir tutum sergiledi. Ancak takım çalışması deneyimleri sınırlı görünüyor. Proaktif problem çözme yerine reaktif yaklaşım gösterdi. Şirket kültürüne uyum sağlayabilir ancak mentorluk desteğine ihtiyacı var."
      }
    `;

    const prompt = `
      Aşağıdaki ${interview.position} pozisyonu için yapılan mülakat konuşmasını DETAYLI olarak analiz et.
      
      MÜLAKAT KONUŞMASI:
      """
      ${conversationText}
      """
      
      ÖNEMLİ: 
      - Her değerlendirmede SOMUT örnekler ver
      - "İyi", "orta", "geliştirilmeli" gibi genel ifadeler KULLANMA
      - Adayın verdiği GERÇEK yanıtlardan alıntı yap
      - Roadmap'te UYGULANABILIR eylemler öner
      - JSON formatında yanıt ver
    `;

    // 10. Gemini AI'dan Analiz Al (Fallback ve System Instruction ile)
    const text = await generateGeminiContent(prompt, systemInstruction);

    if (!text) {
      throw new Error("AI yanıtı boş.");
    }

    // 11. JSON Temizle ve Parse Et
    const cleanJson = text.replace(/```json|```/g, "").trim();

    let analysisData: {
      score: number;
      summary: string;
      strengths: string[];
      improvements: string[];
      culturalFit: string;
      roadmap: string[];
    };

    try {
      analysisData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      console.error("AI Response:", text);
      return NextResponse.json(
        { error: "AI yanıtı işlenemedi." },
        { status: 500 }
      );
    }

    // 12. Veri Validasyonu ve Default Değerler
    const score =
      typeof analysisData.score === "number"
        ? Math.min(100, Math.max(0, analysisData.score))
        : 70;
    const summary = analysisData.summary || "Analiz oluşturuldu.";
    const strengths = Array.isArray(analysisData.strengths)
      ? analysisData.strengths.slice(0, 5)
      : [];
    const improvements = Array.isArray(analysisData.improvements)
      ? analysisData.improvements.slice(0, 5)
      : [];

    // 13. Veritabanını Güncelle
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        isCompleted: true,
        score,
        summary,
        strengths,
        improvements,
        culturalFit: analysisData.culturalFit || "Kültürel uyum analizi tamamlandı.",
        roadmap: Array.isArray(analysisData.roadmap) ? analysisData.roadmap : [],
        analyzedAt: new Date(),
      },
    });

    // 14. Kullanıcıya XP Ekle (+50)
    const xpResult = await addXP(user.id, XP_VALUES.INTERVIEW_COMPLETE);

    // 15. Başarılı Yanıt Döndür
    return NextResponse.json(
      {
        success: true,
        analysis: {
          score,
          summary,
          strengths,
          improvements,
          culturalFit: analysisData.culturalFit || "Kültürel uyum analizi tamamlandı.",
          roadmap: Array.isArray(analysisData.roadmap) ? analysisData.roadmap : [],
        },
        xp: {
          gained: XP_VALUES.INTERVIEW_COMPLETE,
          total: xpResult.newXP,
          leveledUp: xpResult.leveledUp,
          level: xpResult.newLevel,
          levelName: xpResult.newLevelName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Interview Analysis API Error:", error);

    let errorMessage = "Analiz sırasında bir hata oluştu.";
    let statusCode = 500;

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("resource exhausted") || msg.includes("quota") || msg.includes("429")) {
        errorMessage = "Servis şu an çok yoğun. Lütfen 1-2 dakika bekleyip tekrar deneyin.";
        statusCode = 429;
      } else if (msg.includes("candidate block") || msg.includes("safety")) {
         errorMessage = "İçerik güvenlik politikaları nedeniyle işlenemedi.";
         statusCode = 400;
      } else if (msg.includes("not found") || msg.includes("404")) {
          errorMessage = "Analiz servisine şu an erişilemiyor. Lütfen daha sonra tekrar deneyin.";
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
