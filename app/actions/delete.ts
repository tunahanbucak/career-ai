"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to check if user is admin
const isAdmin = (email: string | null | undefined) => {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
};

export async function deleteCV(cvId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return { error: "Unauthorized" };
    }

    const cv = await prisma.cV.findUnique({
      where: { id: cvId },
      select: { userId: true },
    });

    if (!cv) {
      return { error: "CV not found" };
    }

    // Check ownership or admin status
    const isOwner = cv.userId === session.user.id;
    const isUserAdmin = isAdmin(session.user.email);

    if (!isOwner && !isUserAdmin) {
      return { error: "Forbidden: You do not have permission to delete this CV" };
    }

    await prisma.cV.delete({
      where: { id: cvId },
    });

    revalidatePath("/me/cv-analysis");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting CV:", error);
    return { error: "Failed to delete CV" };
  }
}

export async function deleteInterview(interviewId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return { error: "Unauthorized" };
    }

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      select: { userId: true },
    });

    if (!interview) {
      return { error: "Interview not found" };
    }

    // Check ownership or admin status
    const isOwner = interview.userId === session.user.id;
    const isUserAdmin = isAdmin(session.user.email);

    if (!isOwner && !isUserAdmin) {
      return {
        error: "Forbidden: You do not have permission to delete this interview",
      };
    }

    await prisma.interview.delete({
      where: { id: interviewId },
    });

    revalidatePath("/me/interviews");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting interview:", error);
    return { error: "Failed to delete interview" };
  }
}
