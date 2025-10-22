"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const DashboardPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-center mt-20">Yükleniyor...</div>;
  }

  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <div className="p-8 mt-4">
      <h2 className="text-3xl font-bold text-green-700">
        🚀 Dashboarda Hoş Geldin, {session.user.name || session.user.email}!
      </h2>
      <p className="mt-4 text-lg text-gray-700">
        Bu, projemizin ana kontrol panelidir. Buraya CV Analizi ve Mülakat
        Simülasyonu kartlarını ekleyeceğiz.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <h3 className="text-xl font-semibold">1. CV Analizi</h3>
          <p className="text-blue-800">
            Yeni CV yükle ve Gemini Pro ile analiz et.
          </p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <h3 className="text-xl font-semibold">2. Mülakat Simülasyonu</h3>
          <p className="text-purple-800">
            Pozisyon seç ve AI ile mülakata başla.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
