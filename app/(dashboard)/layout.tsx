import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>
      <Navbar />
      <Sidebar user={session.user} />

      <main className="pt-20 lg:pl-72 min-h-screen relative z-10">
        <div className="container mx-auto max-w-[1600px] p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
