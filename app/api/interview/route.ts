import { NextRequest, NextResponse } from "next/server";
import ai from "@/app/utils/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";

// Node.js runtime kullanılacağını belirtiyoruz (AI işlemleri için gerekli olabilir)
export const runtime = "nodejs";

// Mülakat geçmişi için mesaj tipi
type InterviewHistoryMessage = {
  role: "assistant" | "user";
  content: string;
};

// API İstek gövdesi tipi
interface InterviewRequestBody {
  position?: string;
  message?: string;
  history?: InterviewHistoryMessage[];
  start?: boolean;
  interviewId?: string;
}

// POST: Mülakat simülasyonu için AI yanıtı oluşturur
export async function POST(req: NextRequest) {
  try {
    // 1. Oturum Kontrolü
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }

    // 2. İstek Verilerini Okuma
    const { position, history, message, start, interviewId } = (await req.json()) as InterviewRequestBody;

    const hasUserMessage = typeof message === "string" && message.trim().length > 0;
    const isStart = Boolean(start);
    
    // Mesaj yoksa ve başlangıç değilse hata ver
    if (!hasUserMessage && !isStart) {
      return NextResponse.json({ error: "Mesaj gerekli." }, { status: 400 });
    }

    const role = typeof position === "string" && position.trim().length > 0 ? position.trim() : "Genel Yazılım Geliştirici";

    // 3. AI Sistem Talimatı (Prompt) Hazırlama
    const systemPrompt = `Sen profesyonel bir teknik mülakat simülatörüsün. Rol: ${role}.
- Kısa ve net sorular sor.
- Adayın yanıtına göre derinleş.
- Gerektiğinde geri bildirim ver.
Yanıtlarını Türkçe ver.`;

    // 4. Geçmişi Metne Çevirme (Context Window için)
    const historyText = Array.isArray(history)
      ? history
          .map((m) => {
            const r = m.role === "assistant" ? "Mülakatçı" : "Aday";
            const c = m.content || "";
            return `${r}: ${c}`;
          })
          .join("\n")
      : "";

    // 5. Tam Prompt Oluşturma
    const fullPrompt = isStart
      ? `${systemPrompt}\n\nGeçmiş:\n${historyText}\n\nLütfen ${role} pozisyonu için ilk teknik mülakat sorunu sor. Kısa ve net olsun.\n\nMülakatçı:`
      : `${systemPrompt}\n\nGeçmiş:\n${historyText}\n\nAday: ${message}\n\nMülakatçı:`;

    // 6. Gemini AI İsteği
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    if (!response.text) {
      return NextResponse.json({ error: "Yanıt oluşturulamadı." }, { status: 500 });
    }

    const reply = response.text.trim();

    // 7. Veritabanına Kayıt
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

    let createdInterviewId = interviewId;
    
    // Eğer yeni bir mülakatsa DB kaydı oluştur
    if (isStart) {
      const created = await prisma.interview.create({
        data: { position: role, userId: user.id },
        select: { id: true },
      });
      createdInterviewId = created.id;
    }
    if (!createdInterviewId) {
      return NextResponse.json({ error: "interviewId gerekli." }, { status: 400 });
    }

    // Kullanıcı mesajını kaydet
    if (hasUserMessage) {
      await prisma.interviewMessage.create({
        data: { interviewId: createdInterviewId, role: "USER", content: message!.trim() },
        select: { id: true }
      });
    }
    // AI yanıtını kaydet
    await prisma.interviewMessage.create({
      data: { interviewId: createdInterviewId, role: "ASSISTANT", content: reply },
      select: { id: true }
    });

    return NextResponse.json(
      {
        reply,
        interviewId: createdInterviewId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Interview API Error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
