"use client";

import { useState, FormEvent } from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NewsletterFormProps {
  variant?: "footer" | "inline";
}

export default function NewsletterForm({
  variant = "footer",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Lütfen geçerli bir e-posta adresi girin");
      return;
    }

    setStatus("loading");
    setMessage("");

    setTimeout(() => {
      console.log("Newsletter signup:", email);
      setStatus("success");
      setMessage("Harika! E-posta listemize katıldınız 🎉");
      setEmail("");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }, 1500);
  };

  const isFooterVariant = variant === "footer";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@ornek.com"
            disabled={status === "loading" || status === "success"}
            className={`w-full rounded-lg border bg-slate-900/50 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 
              focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${status === "error" ? "border-red-500/50" : "border-slate-800"}
              ${isFooterVariant ? "text-sm" : "text-base"}
            `}
          />
        </div>
        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 
            text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all
            disabled:opacity-70 disabled:cursor-not-allowed
            ${isFooterVariant ? "h-10 text-sm" : "h-11 text-base"}
          `}
        >
          {status === "loading" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {status === "success" && <CheckCircle2 className="mr-2 h-4 w-4" />}
          {status === "loading"
            ? "Gönderiliyor..."
            : status === "success"
            ? "Kaydedildi!"
            : "Abone Ol"}
        </Button>
      </form>
      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-3 text-xs font-medium ${
              status === "error" ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
      {isFooterVariant && status === "idle" && (
        <p className="mt-3 text-xs text-slate-500">
          Haftalık kariyer ipuçları ve güncellemeler alın. Spam yok, söz!
        </p>
      )}
    </div>
  );
}
