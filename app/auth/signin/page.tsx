"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Github, Mail, Command, CheckCircle2 } from "lucide-react";

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Bağlantı hazırlanıyor...");

    const res = await signIn("email", {
      email,
      redirect: false,
    });

    if (res?.error) {
      setMessage("Hata: " + res.error);
    } else {
      setMessage("✅ Giriş bağlantısı e-postana gönderildi!");
    }
    setLoading(false);
  };

  // Google Logosu için SVG (Resim dosyası derdinden kurtulmak için)
  const GoogleIcon = () => (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
        <path
          fill="#4285F4"
          d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
        />
        <path
          fill="#34A853"
          d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
        />
        <path
          fill="#FBBC05"
          d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
        />
        <path
          fill="#EA4335"
          d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
        />
      </g>
    </svg>
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
      {/* --- Background Effects --- */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
        <div className="absolute right-0 top-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px] translate-x-1/2" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center z-10">
        {/* --- Sol Taraf: İkna Edici Metin --- */}
        <div className="hidden lg:block space-y-8 animate-in slide-in-from-left-8 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Yapay Zeka Destekli Kariyer
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
            Kariyer yolculuğuna <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              hız kazandır.
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-md">
            CV analizleri, mülakat simülasyonları ve kişisel gelişim takibi.
            Hepsi tek bir platformda.
          </p>

          <div className="space-y-4 pt-4">
            {[
              "Saniyeler içinde CV analizi",
              "Gerçekçi mülakat deneyimi",
              "Detaylı gelişim raporları",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                {item}
              </div>
            ))}
          </div>

          {/* Küçük İstatistik Kartları */}
          <div className="flex gap-4 pt-6">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur">
              <div className="text-2xl font-bold text-white">%93</div>
              <div className="text-xs text-slate-400">Mülakat Başarısı</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur">
              <div className="text-2xl font-bold text-white">10k+</div>
              <div className="text-xs text-slate-400">Analiz Edilen CV</div>
            </div>
          </div>
        </div>

        {/* --- Sağ Taraf: Login Formu --- */}
        <div className="w-full max-w-md mx-auto lg:mx-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150">
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/10">
            {/* Logo Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                <Command className="text-white w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Hoş Geldin</h2>
              <p className="text-slate-400 text-sm mt-2">
                Hesabına giriş yap ve devam et.
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => signIn("google")}
                className="group relative w-full flex items-center justify-center gap-3 rounded-lg bg-white text-slate-900 px-4 py-3 text-sm font-semibold transition-all hover:bg-slate-100 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
              >
                <GoogleIcon />
                Google ile Devam Et
              </button>

              <button
                onClick={() => signIn("github")}
                className="group w-full flex items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:border-slate-600"
              >
                <Github className="w-5 h-5" />
                GitHub ile Devam Et
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500 font-medium tracking-wider">
                  veya e-posta
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 ml-1">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="sen@ornek.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/50 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <>
                    Giriş Bağlantısı Gönder <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Feedback Message */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-lg text-xs text-center font-medium animate-in fade-in slide-in-from-top-2 ${
                  message.includes("Hata")
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {message}
              </div>
            )}

            <p className="mt-8 text-center text-[11px] text-slate-500 px-4">
              Giriş yaparak{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                Kullanım Koşulları
              </a>{" "}
              ve{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                Gizlilik Politikası
              </a>
              &apos;nı kabul etmiş olursun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
