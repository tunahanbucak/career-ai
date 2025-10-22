import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen pt-20">
      <section className="py-20 text-center max-w-4xl px-4">
        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
          CareerAI
        </h1>
        <h2 className="mt-4 text-2xl font-light text-blue-600">
          Yapay Zeka ile Kariyerini Kodla. Sadece Çalışan Değil, Gelişen Bir
          Platform.
        </h2>
        <p className="mt-8 text-lg text-gray-600">
          CV analizinden mülakat simülasyonuna kadar tüm kariyer yolculuğunda
          akıllı rehberin.
        </p>
      </section>

      <section className="w-full py-16 bg-white border-t border-b border-gray-100">
        <h3 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Nasıl Çalışır? (3 Adım)
        </h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="text-center p-6 bg-blue-50 rounded-xl shadow-lg transition hover:shadow-2xl">
            <div className="text-blue-600 text-5xl mb-4 font-extrabold">1</div>
            <h4 className="text-xl font-semibold mb-2">CV Yükle & Başlat</h4>
            <p className="text-gray-600">
              PDF/DOCX formatındaki CV ni güvenli bir şekilde platforma yükle.
            </p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-xl shadow-lg transition hover:shadow-2xl">
            <div className="text-green-600 text-5xl mb-4 font-extrabold">2</div>
            <h4 className="text-xl font-semibold mb-2">AI Analizini Al</h4>
            <p className="text-gray-600">
              Gemini Pro, saniyeler içinde yetkinliklerini ve eksiklerini
              raporlasın.
            </p>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-xl shadow-lg transition hover:shadow-2xl">
            <div className="text-purple-600 text-5xl mb-4 font-extrabold">
              3
            </div>
            <h4 className="text-xl font-semibold mb-2">Kariyerini Planla</h4>
            <p className="text-gray-600">
              Öneriler ve sanal mülakatlarla kendini geliştirme yolunu çiz.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 text-center max-w-4xl px-4">
        <h3 className="text-3xl font-bold text-gray-700 mb-6">
          Teknolojik Güç
        </h3>
        <p className="text-gray-500 mb-8">
          Projemizin temeli, modern yazılım mimarisinin en güçlü ve ücretsiz
          araçlarına dayanmaktadır.
        </p>
        <div className="flex justify-center space-x-8">
          <span className="text-lg font-semibold text-blue-700">
            Next.js 14
          </span>
          <span className="text-lg font-semibold text-teal-600">
            Tailwind CSS
          </span>
          <span className="text-lg font-semibold text-green-700">Neon DB</span>
          <span className="text-lg font-semibold text-gray-800">
            Gemini Pro AI
          </span>
        </div>
      </section>
    </div>
  );
}
