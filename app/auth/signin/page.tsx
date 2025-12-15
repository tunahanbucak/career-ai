"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Github,
  Mail,
  CheckCircle2,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Logo from "@/app/components/Logo";
import LoadingScreen from "@/app/components/LoadingScreen";

const testimonials = [
  {
    quote:
      "CareerAI sayesinde mülakatlara olan güvenim 10 kat arttı. Eksiklerimi nokta atışı tespit etmesi inanılmazdı. Hayalimdeki işe kabul edildim.",
    author: "Ahmet Yılmaz",
    role: "Yazılım Mühendisi @ TechCorp",
    initial: "A",
  },
  {
    quote:
      "CV'mi yükledim ve 2 dakika içinde detaylı analiz aldım. ATS uyumluluğumu artırdım ve daha fazla geri dönüş almaya başladım.",
    author: "Zeynep Demir",
    role: "Ürün Yöneticisi @ StartupXYZ",
    initial: "Z",
  },
  {
    quote:
      "Mülakat simülasyonu gerçek mülakatlara çok benziyordu. AI koçumun geri bildirimleri sayesinde kendimi çok daha iyi ifade ediyorum.",
    author: "Mehmet Kaya",
    role: "Veri Analisti @ DataCo",
    initial: "M",
  },
];

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <LoadingScreen
        text={
          status === "authenticated"
            ? "Yönlendiriliyor..."
            : "Oturum açılıyor..."
        }
      />
    );
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError && validateEmail(value)) {
      setEmailError("");
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Lütfen geçerli bir e-posta adresi girin");
      return;
    }

    setEmailError("");
    setLoading(true);
    setMessage("Sihirli bağlantı hazırlanıyor...");

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

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

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
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[150px] animate-pulse-slow delay-1000" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>

        <div className="relative z-10">
          <Logo textSize="2xl" />
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <blockquote className="text-2xl font-medium text-white mb-6 leading-relaxed">
                  <Quote className="w-8 h-8 text-indigo-500 mb-4 opacity-50 absolute -left-10 -top-2" />
                  &quot;{testimonials[currentTestimonial].quote}&quot;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
                    {testimonials[currentTestimonial].initial}
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-sm text-slate-400">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={prevTestimonial}
                aria-label="Önceki referans"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>
              <div className="flex gap-2 flex-1 justify-center">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    aria-label={`Referans ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentTestimonial
                        ? "w-8 bg-indigo-500"
                        : "w-1.5 bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                aria-label="Sonraki referans"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2024 CareerAI Inc. Tüm hakları saklıdır.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="lg:hidden inline-flex mb-6">
              <Logo textSize="2xl" />
            </Link>
            <h2 className="text-3xl font-bold text-white mb-2">Hoş Geldin</h2>
            <p className="text-slate-400">
              Kariyer yolculuğuna devam etmek için giriş yap.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-300 font-medium">
                2,000+ profesyonel kullanıyor
              </span>
            </motion.div>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => signIn("google")}
              aria-label="Google hesabınızla giriş yapın"
              className="group relative w-full flex items-center justify-center gap-3 rounded-xl bg-white text-slate-950 px-4 py-3.5 text-sm font-semibold transition-all hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5"
            >
              <GoogleIcon />
              Google ile Devam Et
            </button>

            <button
              onClick={() => signIn("github")}
              aria-label="GitHub hesabınızla giriş yapın"
              className="group w-full flex items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:border-slate-700 hover:-translate-y-0.5"
            >
              <Github className="w-5 h-5 group-hover:text-white transition-colors" />
              GitHub ile Devam Et
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-500 font-medium tracking-wider">
                veya e-posta
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 ml-1">
                E-posta Adresi
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="sen@sirket.com"
                  value={email}
                  onChange={handleEmailChange}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={`w-full rounded-xl border bg-slate-900/50 pl-11 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none ${
                    emailError ? "border-red-500/50" : "border-slate-800"
                  }`}
                />
              </div>
              {emailError && (
                <p id="email-error" className="mt-2 text-xs text-red-400">
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl text-sm text-center font-medium flex items-center justify-center gap-2 ${
                message.includes("Hata")
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}
            >
              {message.includes("Hata") ? null : <CheckCircle2 size={16} />}
              {message}
            </motion.div>
          )}

          <p className="mt-8 text-center text-[11px] text-slate-500 px-4">
            Giriş yaparak{" "}
            <a
              href="#"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Kullanım Koşulları
            </a>{" "}
            ve{" "}
            <a
              href="#"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Gizlilik Politikası
            </a>
            &apos;nı kabul etmiş olursun.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
