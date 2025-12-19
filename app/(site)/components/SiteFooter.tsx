import Link from "next/link";
import Logo from "@/components/shared/Logo";
import NewsletterForm from "@/components/shared/NewsletterForm";
import SocialLinks from "@/components/shared/SocialLinks";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-4">
            <Logo textSize="xl" />
            <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-sm">
              Yapay zeka destekli kariyer koçu ile geleceğini tasarla. CV
              analizi, mülakat simülasyonu ve kişiselleştirilmiş kariyer
              rehberliği.
            </p>
            <div className="mt-6">
              <h3 className="text-white font-semibold text-sm mb-3">
                Güncel Kalın
              </h3>
              <NewsletterForm variant="footer" />
            </div>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-sm mb-4">Ürün</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#ozellikler"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Özellikler
                </Link>
              </li>
              <li>
                <Link
                  href="/#nasil-calisir"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Nasıl Çalışır
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/me/cv-analyses"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  CV Analizi
                </Link>
              </li>
              <li>
                <Link
                  href="/me/interviews"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Mülakat Simülasyonu
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-sm mb-4">Kaynaklar</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#sss"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  SSS
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Yardım Merkezi
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  href="/admin/system-updates"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Güncellemeler
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-sm mb-4">Şirket</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@careerai.app"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  İletişim
                </a>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  Çerez Politikası
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-sm mb-4">Sosyal</h3>
            <SocialLinks variant="footer" />
            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-2">Destek</p>
              <a
                href="mailto:info@careerai.app"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                info@careerai.app
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © 2025 CareerAI. Tüm hakları saklıdır.{" "}
              <span className="text-slate-600">
                Yapay zeka destekli kariyer platformu - Bitirme Projesi
              </span>
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span>Made with ❤️ in Turkey</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
