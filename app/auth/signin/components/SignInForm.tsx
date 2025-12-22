"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

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

  return (
    <>
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
    </>
  );
}
