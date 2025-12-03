import { NextRequest, NextResponse } from "next/server";
import ai from "@/app/utils/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }

    const { position, history, message, start, interviewId }: {
      position?: string;
      message?: string;
      history?: Array<{ role: "assistant" | "user"; content: string }>;
      start?: boolean;
      interviewId?: string;
    } = await req.json();

    const hasUserMessage = typeof message === "string" && message.trim().length > 0;
    const isStart = Boolean(start);
    if (!hasUserMessage && !isStart) {
      return NextResponse.json({ error: "Mesaj gerekli." }, { status: 400 });
    }

    const role = typeof position === "string" && position.trim().length > 0 ? position.trim() : "Genel Yazılım Geliştirici";

    const systemPrompt = `Sen profesyonel bir teknik mülakat simülatörüsün. Rol: ${role}.
- Kısa ve net sorular sor.
- Adayın yanıtına göre derinleş.
- Gerektiğinde geri bildirim ver.
Yanıtlarını Türkçe ver.`;

    // Basit geçmiş formatını tek bir metne çeviriyoruz.
    const historyText = Array.isArray(history)
      ? history
          .map((m) => {
            const r = m.role === "assistant" ? "Mülakatçı" : "Aday";
            const c = m.content || "";
            return `${r}: ${c}`;
          })
          .join("\n")
      : "";

    const fullPrompt = isStart
      ? `${systemPrompt}\n\nGeçmiş:\n${historyText}\n\nLütfen ${role} pozisyonu için ilk teknik mülakat sorunu sor. Kısa ve net olsun.\n\nMülakatçı:`
      : `${systemPrompt}\n\nGeçmiş:\n${historyText}\n\nAday: ${message}\n\nMülakatçı:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    if (!response.text) {
      return NextResponse.json({ error: "Yanıt oluşturulamadı." }, { status: 500 });
    }

    const reply = response.text.trim();

    // DB Kalıcılık
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

    let createdInterviewId = interviewId;
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

    // Geçmişi DB'ye eklemiyoruz (tekrar gönderilebilir), sadece yeni mesajları ekleyelim
    if (hasUserMessage) {
      await prisma.interviewMessage.create({
        data: { interviewId: createdInterviewId, role: "USER", content: message!.trim() },
      });
    }
    await prisma.interviewMessage.create({
      data: { interviewId: createdInterviewId, role: "ASSISTANT", content: reply },
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
