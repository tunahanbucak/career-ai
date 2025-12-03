import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

    const [cvs, analyses, interviews] = await Promise.all([
      prisma.cV.findMany({
        where: { userId: user.id },
        orderBy: { uploadDate: "desc" },
        take: 10,
        select: { id: true, title: true, uploadDate: true },
      }),
      prisma.cVAnalysis.findMany({
        where: { cv: { userId: user.id } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, keywords: true, createdAt: true, cvId: true },
      }),
      prisma.interview.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
        take: 10,
        select: { id: true, position: true, date: true, _count: { select: { messages: true } } },
      }),
    ]);

    return NextResponse.json({ cvs, analyses, interviews }, { status: 200 });
  } catch (e) {
    console.error("/api/me/history error:", e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
