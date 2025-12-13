import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import SettingsForm from "./components/SettingsForm";

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
    }
  });

  if (!user) redirect("/");

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8 pb-20">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Hesap Ayarları
        </h1>
        <p className="text-slate-400 mt-2">
          Kişisel bilgilerinizi ve kariyer profilinizi buradan yönetebilirsiniz.
        </p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}
