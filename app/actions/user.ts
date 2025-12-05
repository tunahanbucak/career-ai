"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string; bio?: string }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/me/settings");
    
    return { success: true, user };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
