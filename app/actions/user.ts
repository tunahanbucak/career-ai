"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { z } from "zod";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır.")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "İsim sadece harf içerebilir."),
  bio: z.string().optional(),
});

export async function updateProfile(data: { name: string; bio?: string }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const result = profileSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: result.data.name,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/me/settings");

    return { success: true, user };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Profil güncellenirken bir hata oluştu" };
  }
}
