import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token bulunamadı" },
        { status: 400 }
      );
    }

    const isValid = await verifyRecaptcha(token);

    if (isValid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: "Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin."
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("reCAPTCHA API rotası hatası:", error);
    return NextResponse.json(
      { success: false, message: "Doğrulama sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
