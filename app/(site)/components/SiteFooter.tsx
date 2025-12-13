import Logo from "@/app/components/Logo";
export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 py-8 ">
          <Logo textSize="lg" />
        </div>
        <p className="text-slate-500 text-sm">
          © 2025 CareerAI. Tüm hakları saklıdır. Bir Bitirme Projesidir.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-slate-500 hover:text-indigo-400 transition-colors"
          >
            Gizlilik
          </a>
          <a
            href="#"
            className="text-slate-500 hover:text-indigo-400 transition-colors"
          >
            Kullanım Şartları
          </a>
        </div>
      </div>
    </footer>
  );
}
