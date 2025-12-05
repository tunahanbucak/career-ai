// app/api/upload-cv/route.ts
// PDF ve DOCX DOSYALARINDAN METİN ÇIKARAN NİHAİ SERVER ACTION

/* eslint-disable @typescript-eslint/no-require-imports */ // require hatasını engeller

import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth"; // DOCX için (Kurulu olmalı)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";

// 💡 ÇÖZÜM: Kütüphanenin kendisini import ediyoruz ve içindeki fonksiyonu kullanacağız.
// Bu, require ile import edilen objenin içindeki fonksiyonu bulmanın en güvenilir yoludur.
const pdfParse = require("pdf-parse");

export const runtime = "nodejs";

// Tür yardımcıları
const isRecord = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object";

// pdf-parse fonksiyonunu basit ve stabil şekilde çöz
type PdfParseFn = (b: Buffer) => Promise<{ text?: string }>;

async function resolvePdfParse(): Promise<PdfParseFn> {
  const m: unknown = pdfParse;
  if (typeof m === "function") return m as PdfParseFn;
  if (isRecord(m) && typeof m.default === "function") return m.default as PdfParseFn;
  if (isRecord(m) && typeof (m as Record<string, unknown>).pdf === "function") {
    return (m as { pdf: PdfParseFn }).pdf;
  }

  // Dinamik import fallback
  const mod: unknown = await import("pdf-parse");
  if (typeof mod === "function") return mod as PdfParseFn;
  if (isRecord(mod) && typeof mod.default === "function") return mod.default as PdfParseFn;
  throw new TypeError("pdf-parse modülü çözümlenemedi (uyumlu fonksiyon bulunamadı)");
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const fileName = file.name || "cv";
    const contentType = file.type || "";
    const isPDF = contentType.includes("pdf") || fileName.toLowerCase().endsWith(".pdf");
    const isDOCX = contentType.includes("officedocument.wordprocessingml.document") || fileName.toLowerCase().endsWith(".docx");
    if (!isPDF && !isDOCX) {
      return NextResponse.json(
        { error: "Desteklenmeyen dosya türü. Lütfen PDF veya DOCX yükleyin." },
        { status: 400 }
      );
    }
    const MAX_SIZE = 8 * 1024 * 1024;
    if (typeof (file as File).size === "number" && (file as File).size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Dosya boyutu 8MB sınırını aşıyor." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let rawText = "";

    // --- PDF PARSING (HATA ÇÖZÜMÜ BURADA!) ---
    if (isPDF) {
      const parseFunction = await resolvePdfParse();
      const data = await parseFunction(buffer);
      rawText = data.text || "";
      
    // --- DOCX PARSING ---
    } else if (isDOCX) {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || "";
    } else {
      return NextResponse.json(
        { error: "Desteklenmeyen dosya türü. Lütfen PDF veya DOCX yükleyin." },
        { status: 400 }
      );
    }

    rawText = rawText.replace(/\u0000/g, " ").replace(/\s+/g, " ").trim();

    if (!rawText) {
      return NextResponse.json(
        { error: "Dosyadan metin çıkarılamadı. Lütfen farklı bir dosya deneyin." },
        { status: 422 }
      );
    }

    // DB'ye kaydet
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }
    const data: Record<string, unknown> = {
      title: fileName.replace(/\.(pdf|docx)$/i, ""),
      filename: fileName,
      mime: contentType || null,
      rawText,
      userId: user.id,
    };
    if (typeof (file as File).size === "number") {
      (data as { size: number }).size = (file as File).size;
    }
    const created = await prisma.cV.create({
      data: data as {
        title: string; filename: string; mime: string | null; rawText: string; userId: string; size?: number;
      },
      select: { id: true, title: true },
    });

    // Başarılı yanıt gönder (Faz 4'e girdi)
    return NextResponse.json(
      {
        success: true,
        cvId: created.id,
        title: created.title,
        rawText,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CV Yükleme/Parse Hatası:", error);
    return NextResponse.json(
      { error: "Dosya işlenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}