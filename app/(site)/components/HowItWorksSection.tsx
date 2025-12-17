import { Badge } from "@/components/ui/badge";

export default function HowItWorksSection() {
  return (
    <section
      id="nasil-calisir"
      className="max-w-7xl mx-auto px-6 mb-32 bg-slate-900/20 py-20 rounded-3xl border border-slate-800/50 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
      <div className="text-center mb-12 relative z-10">
        <Badge
          variant="secondary"
          className="bg-indigo-950 text-indigo-300 border-none mb-3"
        >
          Adım Adım
        </Badge>
        <h2 className="text-3xl font-bold text-white">Nasıl Çalışır?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 relative z-10">
        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent -z-10"></div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-950 flex items-center justify-center text-2xl font-bold text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10 z-10">
            1
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Hesap Oluştur
          </h3>
          <p className="text-slate-400 text-sm">
            Hızlıca kayıt ol ve profilini oluştur.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-950 flex items-center justify-center text-2xl font-bold text-purple-400 mb-4 shadow-lg shadow-purple-500/10 z-10">
            2
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            CV Yükle & Analiz Et
          </h3>
          <p className="text-slate-400 text-sm">
            PDF formatında yükle, yapay zeka süzgecinden geçir.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-950 flex items-center justify-center text-2xl font-bold text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10 z-10">
            3
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Mülakata Hazırlan
          </h3>
          <p className="text-slate-400 text-sm">
            Eksiklerini tamamla ve simülasyonlarla hazırlan.
          </p>
        </div>
      </div>
    </section>
  );
}
