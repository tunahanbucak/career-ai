"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Kullanıcı profil güncelleme işlemini yapan Server Action.
// 'use server' direktifi ile bu kodun sacede sunucuda çalışmasını sağlarız.
type State =
  | { success: false; message: string }
  | { success: true; message: string }
  | null;

export async function updateProfile(prevState: State, formData: FormData) {
  // 1. Oturum Kontrolü: İşlemi yapan kişinin giriş yapmış olduğundan emin ol.
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return { success: false, message: "Oturum açmanız gerekiyor." };
  }

  // 2. Form Verilerini Al: İstemciden gelen verileri değişkenlere ata.
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const title = formData.get("title") as string;
  const about = formData.get("about") as string;

  // 3. Validasyon (Doğrulama) Kuralları
  // İsim sadece harflerden oluşmalı, rakam içeremez.
  if (name && /[0-9]/.test(name)) {
    return { success: false, message: "İsimde rakam bulunamaz." };
  }
  // Telefon sadece rakamlardan oluşmalı, harf içeremez.
  if (phone && /[a-zA-Z]/.test(phone)) {
    return { success: false, message: "Telefon numarasında harf bulunamaz." };
  }
  // Unvan sadece harflerden oluşmalı, rakam içeremez.
  if (title && /[0-9]/.test(title)) {
    return { success: false, message: "Unvanda rakam bulunamaz." };
  }

  try {
    // 4. Veritabanı Güncellemesi: Prisma (ORM) kullanarak veriyi güncelle.
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        title,
        about,
      },
    });

    // 5. Cache Temizleme: Profil bilgisi değiştiği için ilgili sayfaları yeniden oluşturmasını söyle.
    // Bu sayede kullanıcı sayfayı yenilediğinde eski veriyi görmez.
    revalidatePath("/settings");
    revalidatePath("/me/account");

    return { success: true, message: "Profil başarıyla güncellendi!" };
  } catch (error: unknown) {
    // Hata Yönetimi: Olası veritabanı hatalarını yakala ve logla.
    console.error("Profil güncelleme hatası:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    return { success: false, message: `Hata: ${errorMessage}` };
  }
}
