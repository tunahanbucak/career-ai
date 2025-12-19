import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import ai from "@/app/utils/gemini";
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
      return NextResponse.json({ error: "interviewId gerekli." }, { status: 400 });
    }

    // 3. Kullanıcıyı Bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
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
      return NextResponse.json({ error: "Mülakat bulunamadı." }, { status: 404 });
    }

    // 5. Kullanıcının mülakatı olduğundan emin ol
    if (interview.userId !== user.id) {
      return NextResponse.json({ error: "Bu mülakat size ait değil." }, { status: 403 });
    }

    // 6. Zaten analiz edilmişse hata dön
    if (interview.isCompleted) {
      return NextResponse.json({ error: "Bu mülakat zaten analiz edilmiş." }, { status: 400 });
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
    const prompt = `
Sen profesyonel bir İK uzmanısın. Aşağıdaki ${interview.position} pozisyonu için yapılan mülakat konuşmasını analiz et.

İSTENEN ÇIKTI FORMATI (sadece JSON döndür, başka açıklama yapma):
{
  "score": 0-100 arası genel performans puanı (sayı),
  "summary": "Adayın genel performansının 2-3 cümlelik özeti",
  "strengths": ["Güçlü yön 1", "Güçlü yön 2", "Güçlü yön 3"],
  "improvements": ["Gelişim alanı 1", "Gelişim alanı 2", "Gelişim alanı 3"]
}

DEĞERLENDİRME KRİTERLERİ:
- İletişim becerisi
- Teknik bilgi düzeyi
- Problem çözme yaklaşımı
- Cevapların niteliği ve detayı
- Öz güven ve profesyonellik

MÜLAKAT KONUŞMASI:
"""
${conversationText}
"""

Sadece JSON objesini döndür, başka hiçbir şey yazma.
    `.trim();

    // 10. Gemini AI'dan Analiz Al
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();
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
    const score = typeof analysisData.score === "number" ? Math.min(100, Math.max(0, analysisData.score)) : 70;
    const summary = analysisData.summary || "Analiz oluşturuldu.";
    const strengths = Array.isArray(analysisData.strengths) ? analysisData.strengths.slice(0, 5) : [];
    const improvements = Array.isArray(analysisData.improvements) ? analysisData.improvements.slice(0, 5) : [];

    // 13. Veritabanını Güncelle
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        isCompleted: true,
        score,
        summary,
        strengths,
        improvements,
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
    return NextResponse.json(
      { error: "Analiz sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
