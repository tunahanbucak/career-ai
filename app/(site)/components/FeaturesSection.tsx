"use client";

import {
  FileText,
  LineChart,
  MessageSquare,
  Zap,
  Target,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FileText className="w-6 h-6 text-indigo-400" />,
    title: "Akıllı CV Analizi",
    desc: "Yapay zeka CV'ni tarar, ATS uyumluluğunu kontrol eder ve geliştirmen gereken noktaları saniyeler içinde raporlar.",
    gradient: "from-indigo-500/20 to-blue-500/20",
    border: "group-hover:border-indigo-500/50",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-purple-400" />,
    title: "AI Mülakat Simülasyonu",
    desc: "Gerçek mülakat senaryolarıyla pratik yap. Yazılı yanıtlarını analiz eden AI koçun ile teknik mülakatlara hazırlan.",
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "group-hover:border-purple-500/50",
  },
  {
    icon: <LineChart className="w-6 h-6 text-emerald-400" />,
    title: "Kariyer Gelişim Takibi",
    desc: "İlerlemeni görsel grafiklerle takip et. Hangi alanlarda güçlendiğini ve neleri iyileştirmen gerektiğini gör.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "group-hover:border-emerald-500/50",
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Hızlı Geri Bildirim",
    desc: "Beklemek yok. Yüklediğin her döküman ve tamamladığın her mülakat için anında detaylı analiz alırsın.",
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "group-hover:border-amber-500/50",
  },
  {
    icon: <Target className="w-6 h-6 text-cyan-400" />,
    title: "Hedef Odaklı Rota",
    desc: "Başvurmak istediğin pozisyona özel tavsiyeler al. Hedeflediğin iş için en doğru yetenek setine sahip ol.",
    gradient: "from-cyan-500/20 to-sky-500/20",
    border: "group-hover:border-cyan-500/50",
  },
  {
    icon: <Shield className="w-6 h-6 text-rose-400" />,
    title: "Veri Gizliliği",
    desc: "Verilerin uçtan uca şifrelenir. Kişisel bilgilerin ve kariyer geçmişin sadece senin kontrolündedir.",
    gradient: "from-rose-500/20 to-red-500/20",
    border: "group-hover:border-rose-500/50",
  },
];

export default function FeaturesSection() {
  return (
    <section id="ozellikler" className="max-w-7xl mx-auto px-6 mb-32 relative">
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Kariyerin İçin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Tam Donanım
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Seni diğer adaylardan ayıracak, en son yapay zeka teknolojileriyle
            güçlendirilmiş araç seti.
          </p>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`group relative p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-500 hover:-translate-y-2 ${feature.border}`}
          >
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
            />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
                {feature.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
