"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Save,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  FileText,
  Mail,
  Sparkles,
  Award,
} from "lucide-react";
import { updateProfile } from "@/app/actions/profile";
import { Textarea } from "@/components/ui/textarea";

interface SettingsFormProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    title: string | null;
    phone: string | null;
    about: string | null;
  };
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [phoneVal, setPhoneVal] = useState(user.phone || "");
  const [nameVal, setNameVal] = useState(user.name || "");
  const [titleVal, setTitleVal] = useState(user.title || "");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length <= 11) {
      setPhoneVal(val);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Rakam engelle (Sadece harf ve boşluk)
    const val = e.target.value.replace(/[0-9]/g, "");
    setNameVal(val);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Rakam engelle (Sadece harf ve boşluk)
    const val = e.target.value.replace(/[0-9]/g, "");
    setTitleVal(val);
  };

  async function handleSubmit(formData: FormData) {
    if (phoneVal && phoneVal.length !== 11) {
      setMessage({
        type: "error",
        text: "Telefon numarası 11 haneli olmalıdır (05...)",
      });
      return;
    }

    startTransition(async () => {
      const result = await updateProfile(null, formData);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
        await update(); // Session'ı güncelle
      } else {
        setMessage({ type: "error", text: result.message });
      }
      setTimeout(() => setMessage(null), 4000);
    });
  }

  const completionPercentage =
    [user.name, user.title, user.phone, user.about].filter(Boolean).length * 25;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-1"
      >
        <div className="sticky top-6 space-y-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-500/30 ring-4 ring-slate-900">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-full border-4 border-slate-900">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {user.name || "Kullanıcı"}
              </h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Mail className="w-3 h-3 text-indigo-400" />
                <p className="text-indigo-400 text-sm font-medium">
                  {user.email}
                </p>
              </div>
              {user.title && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Briefcase className="w-3 h-3 text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-400">
                    {user.title}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-white">
                  Profil Tamamlanma
                </span>
              </div>
              <span className="text-sm font-bold text-white">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {completionPercentage === 100
                ? "Profile tamamen dolu! 🎉"
                : "Tüm bilgileri doldurarak profilini tamamla"}
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <form
          action={handleSubmit}
          className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-8 space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 pb-6 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-2">
              Kişisel Bilgiler
            </h2>
            <p className="text-sm text-slate-400">
              Profil bilgilerinizi güncel tutun
            </p>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                Ad Soyad <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                type="text"
                value={nameVal}
                onChange={handleNameChange}
                placeholder="Adınız Soyadınız"
                required
                className="w-full h-12 bg-slate-950/50 border border-slate-700 rounded-xl px-4 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Unvan / Pozisyon
              </label>
              <input
                name="title"
                type="text"
                value={titleVal}
                onChange={handleTitleChange}
                placeholder="Örn: Yazılım Mühendisi"
                className="w-full h-12 bg-slate-950/50 border border-slate-700 rounded-xl px-4 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                Telefon
              </label>
              <input
                name="phone"
                type="text"
                value={phoneVal}
                onChange={handlePhoneChange}
                placeholder="05XX XXX XX XX"
                className="w-full h-12 bg-slate-950/50 border border-slate-700 rounded-xl px-4 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono"
              />
              {phoneVal && phoneVal.length !== 11 && (
                <p className="text-xs text-amber-400">11 haneli olmalıdır</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Hakkımda
              </label>
              <Textarea
                name="about"
                defaultValue={user.about || ""}
                placeholder="Kendinizden kısaca bahsedin, yeteneklerinizi ve ilgi alanlarınızı paylaşın..."
                className="min-h-[140px] bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-y"
              />
            </div>
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Değişiklikleri Kaydet
                  </>
                )}
              </Button>
            </div>
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl flex items-center gap-3 ${
                    message.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      message.type === "success"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {message.text}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
