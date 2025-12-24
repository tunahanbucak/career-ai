import { NextRequest, NextResponse } from "next/server";
import { streamGeminiContent } from "@/app/utils/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { verifyRecaptcha } from "@/lib/recaptcha";

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
  recaptchaToken?: string;
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
    const { position, history, message, start, interviewId, recaptchaToken } =
      (await req.json()) as InterviewRequestBody;
      
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

    const hasUserMessage =
      typeof message === "string" && message.trim().length > 0;
    const isStart = Boolean(start);

    // Mesaj yoksa ve başlangıç değilse hata ver
    if (!hasUserMessage && !isStart) {
      return NextResponse.json({ error: "Mesaj gerekli." }, { status: 400 });
    }

    const role =
      typeof position === "string" && position.trim().length > 0
        ? position.trim()
        : "Genel Yazılım Geliştirici";

    // 3. AI Sistem Talimatı (Prompt) Hazırlama
    const systemPrompt = `
      Sen profesyonel, nazik bir teknik mülakat simülatörüsün. 
      Rolün: ${role}.
      
      TALİMATLAR:
      - HER SEFERINDE TEK BİR SORU SOR (çok önemli!)
      - Sorular KISA ve NET olsun (maksimum 2-3 cümle)
      - Adayın yanıtına göre takip sorusu sor
      - Çok detaylı veya çok parçalı sorular SORMA
      - Doğal bir konuşma akışı kur
      - Profesyonel ama samimi bir ton kullan
      - Yanıtlarını sadece Türkçe ver
      
      KÖTÜ ÖRNEK (KULLANMA):
      "Açıklamanız için teşekkürler. Verdiğiniz detaylar üzerine bazı derinleştirici sorularım olacak: 1. Modül Bağımlılıkları... 2. Domain Katmanında... 3. ViewModel..."
      
      İYİ ÖRNEK (KULLAN):
      "Anladım. Peki bu modül bağımlılıklarını pratikte nasıl kontrol ediyorsunuz?"
    `;

    // 4. Geçmişi Metne Çevirme (Context Window için)
    const historyText = Array.isArray(history)
      ? history
          .map((m) => {
            const r = m.role === "assistant" ? "Mülakatçı" : "Aday";
            return `${r}: ${m.content || ""}`;
          })
          .join("\n")
      : "";

    // 5. Tam Prompt Oluşturma
    const fullPrompt = isStart
      ? `${systemPrompt}\n\nGeçmiş:\n${historyText}\n\nLütfen ${role} pozisyonu için ilk teknik mülakat sorunu sor. Kısa ve net olsun.\n\nMülakatçı:`
      : `${systemPrompt}\n\nGeçmiş:\n${historyText}\n\nAday: ${message}\n\nMülakatçı:`;

    // 7. Kullanıcı ve Onay Kontrolü
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user)
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    if (!user.approved)
      return NextResponse.json(
        {
          error:
            "Hesabınız henüz yönetici tarafından onaylanmadı. Mülakat yapabilmek için admin onayı beklemeniz gerekmektedir.",
        },
        { status: 403 }
      );

    let createdInterviewId = interviewId;

    // Eğer yeni bir mülakatsa DB kaydı oluştur
    if (isStart) {
      const created = await prisma.interview.create({
        data: { position: role, userId: user.id },
        select: { id: true },
      });
      createdInterviewId = created.id;
    }

    if (!createdInterviewId)
      return NextResponse.json(
        { error: "interviewId gerekli." },
        { status: 400 }
      );

    // 6. Gemini AI İsteği (Streaming)
    const stream = streamGeminiContent(fullPrompt, systemPrompt);

    // Veritabanına kullanıcı mesajını kaydet
    if (hasUserMessage) {
      await prisma.interviewMessage.create({
        data: {
          interviewId: createdInterviewId,
          role: "USER",
          content: message!.trim(),
        },
      });
    }

    // Streaming Response oluştur
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        let fullReply = "";
        try {
          for await (const chunk of stream) {
            fullReply += chunk;
            controller.enqueue(encoder.encode(chunk));
          }

          // Akış bittiğinde AI yanıtını DB'ye kaydet
          await prisma.interviewMessage.create({
            data: {
              interviewId: createdInterviewId!,
              role: "ASSISTANT",
              content: fullReply,
            },
          });

          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Interview-Id": createdInterviewId,
      },
    });
  } catch (err) {
    console.error("Interview API Error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
