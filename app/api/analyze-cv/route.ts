import { NextRequest, NextResponse } from "next/server";
import ai from "@/app/utils/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }

    const { rawText, title, cvId } = await request.json();

    if (!rawText) {
      return NextResponse.json({ error: "CV metni boş." }, { status: 400 });
    }
    if (!cvId || typeof cvId !== "string") {
      return NextResponse.json({ error: "cvId gerekli." }, { status: 400 });
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

    // DB'ye kaydet
    await prisma.cVAnalysis.create({
      data: {
        cvId,
        title: title ?? null,
        summary: String(analysisResult.summary || ""),
        keywords: Array.isArray(analysisResult.keywords)
          ? analysisResult.keywords.map(String)
          : [],
        suggestion: String(analysisResult.suggestion || ""),
      },
    });
    return NextResponse.json(
      {
        success: true,
        title: title,
        analysis: analysisResult,
        cvId,
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
