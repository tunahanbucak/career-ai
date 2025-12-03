import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email.toLowerCase());
}

function parseDateRange(url: URL) {
  const fromStr = url.searchParams.get("from");
  const toStr = url.searchParams.get("to");
  const from = fromStr ? new Date(fromStr) : null;
  const to = toStr ? new Date(toStr) : null;
  return { from, to };
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !isAdminEmail(session.user?.email)) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "analyses"; // cvs | analyses | interviews
    const { from, to } = parseDateRange(url);

    if (!["cvs", "analyses", "interviews"].includes(type)) {
      return NextResponse.json({ error: "Geçersiz type" }, { status: 400 });
    }

    // Build CSV
    let csv = "";
    if (type === "cvs") {
      const rows = await prisma.cV.findMany({
        where: {
          ...(from || to ? { uploadDate: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
        },
        orderBy: { uploadDate: "desc" },
        include: { user: { select: { email: true } } },
      });
      csv += "title,filename,email,uploadDate\n";
      csv += rows
        .map((r) => [r.title, r.filename, r.user?.email || "", new Date(r.uploadDate).toISOString()].map((v) => `"${String(v).replace(/"/g, '"')}` ).join(","))
        .join("\n");
    } else if (type === "analyses") {
      const rows = await prisma.cVAnalysis.findMany({
        where: {
          ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
        },
        orderBy: { createdAt: "desc" },
        include: { cv: { select: { title: true, user: { select: { email: true } } } } },
      });
      csv += "cvTitle,email,keywords,createdAt\n";
      csv += rows
        .map((r) => [r.cv?.title || "", r.cv?.user?.email || "", Array.isArray(r.keywords) ? r.keywords.join("|") : "", new Date(r.createdAt).toISOString()].map((v) => `"${String(v).replace(/"/g, '"')}` ).join(","))
        .join("\n");
    } else {
      const rows = await prisma.interview.findMany({
        where: {
          ...(from || to ? { date: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
        },
        orderBy: { date: "desc" },
        include: { user: { select: { email: true } }, messages: { select: { id: true } } },
      });
      csv += "email,position,messageCount,date\n";
      csv += rows
        .map((r) => [r.user?.email || "", r.position, (r.messages?.length ?? 0), new Date(r.date).toISOString()].map((v) => `"${String(v).replace(/"/g, '"')}` ).join(","))
        .join("\n");
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=${type}.csv`,
      },
    });
  } catch (e) {
    console.error("Admin CSV Export Error:", e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
