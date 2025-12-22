import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

// Admin kullanıcıyı onaylama/reddetme
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }

    // Admin kontrolü
    const admins = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (!admins.includes(session.user.email.toLowerCase())) {
      return NextResponse.json({ error: "Yalnızca adminler onaylayabilir." }, { status: 403 });
    }

    const { userId, approve } = await request.json();

    if (!userId || typeof approve !== "boolean") {
      return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });
    }

    // Kullanıcıyı güncelle
    await prisma.user.update({
      where: { id: userId },
      data: {
        approved: approve,
        approvedAt: approve ? new Date() : null,
        approvedBy: approve ? session.user.email : null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: approve ? "Kullanıcı onaylandı!" : "Onay kaldırıldı." 
    });
  } catch (error) {
    console.error("Approve API Error:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
