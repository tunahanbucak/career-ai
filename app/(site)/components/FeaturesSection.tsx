import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LineChart, MessageSquare } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="ozellikler" className="max-w-7xl mx-auto px-6 mb-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Her Şey Tek Platformda
        </h2>
        <p className="text-slate-400">
          Kariyer hedeflerine ulaşmak için ihtiyacın olan tüm araçlar hazır.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 hover:border-indigo-500/50 transition-all hover:bg-slate-900 group">
          <CardHeader>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <FileText className="text-indigo-400 w-6 h-6" />
            </div>
            <CardTitle className="text-xl text-slate-100">
              Akıllı CV Analizi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400">
            CV&apos;ni yükle, yapay zeka saniyeler içinde tarasın. Güçlü
            yönlerini, eksik anahtar kelimeleri ve format hatalarını anında
            gör.
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all hover:bg-slate-900 group">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="text-purple-400 w-6 h-6" />
            </div>
            <CardTitle className="text-xl text-slate-100">
              AI Mülakat Koçu
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400">
            Sektörüne özel oluşturulan mülakat sorularıyla pratik yap. Sesli
            veya yazılı yanıtlarına anında detaylı geri bildirim al.
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 transition-all hover:bg-slate-900 group">
          <CardHeader>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <LineChart className="text-emerald-400 w-6 h-6" />
            </div>
            <CardTitle className="text-xl text-slate-100">
              Gelişim Takibi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400">
            Tüm analiz ve mülakat skorlarını grafiklerle takip et.
            Gelişimini somut verilerle gör ve hedefine adım adım yaklaş.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
