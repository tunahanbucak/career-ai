import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import SettingsForm from "./components/SettingsForm";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/");
  }

  // Fetch FRESH user data from DB to avoid session staleness for the form
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      image: true,
      title: true,
      phone: true,
      about: true,
    },
  });

  if (!user) redirect("/");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Hesap Ayarları
          </h1>
          <p className="text-slate-400 mt-1">
            Profil bilgilerinizi yönetin ve kişiselleştirin
          </p>
        </div>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}
