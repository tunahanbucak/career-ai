"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Save, User, Phone, CheckCircle2, AlertCircle, Briefcase, FileText } from "lucide-react";
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Client-side state for controlled inputs (optional, but good for validation feedback)
  const [phoneVal, setPhoneVal] = useState(user.phone || "");
  const [nameVal, setNameVal] = useState(user.name || "");
  const [titleVal, setTitleVal] = useState(user.title || "");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sadece rakam
    const val = e.target.value.replace(/[^0-9]/g, "");
    // Maksimum 11 hane
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
    if (phoneVal.length !== 11) {
        setMessage({ type: "error", text: "Telefon numarası 11 haneli olmalıdır (05...)" });
        return;
    }

    startTransition(async () => {
      const result = await updateProfile(null, formData);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
        await update(); // Session'ı güncelle (Header vb. için)
      } else {
        setMessage({ type: "error", text: result.message });
      }
      setTimeout(() => setMessage(null), 3000);
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
         {/* Sol Taraf: Profil Özeti */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center backdrop-blur-sm">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-indigo-500/20">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h3 className="text-lg font-semibold text-white">{user.name || "Kullanıcı"}</h3>
                <p className="text-indigo-400 text-sm font-medium mb-1">{user.email}</p>
            </div>
         </div>

         {/* Sağ Taraf: Form */}
         <div className="lg:col-span-2">
            <form action={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* 1. Ad Soyad */}
                <div className="space-y-2 relative z-10">
                    <label className="text-sm font-medium text-slate-300 ml-1">
                        Ad Soyad <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                        <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                           name="name"
                           type="text"
                           value={nameVal}
                           onChange={handleNameChange}
                           placeholder="Adınız Soyadınız"
                           required
                           className="w-full h-11 bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* 2. Unvan */}
                 <div className="space-y-2 relative z-10">
                    <label className="text-sm font-medium text-slate-300 ml-1">Unvan</label>
                    <div className="relative group">
                        <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                         <input 
                           name="title"
                           type="text"
                           value={titleVal}
                           onChange={handleTitleChange}
                           placeholder="Örn: Yazılım Mühendisi"
                           className="w-full h-11 bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* 3. Telefon */}
                <div className="space-y-2 relative z-10">
                    <label className="text-sm font-medium text-slate-300 ml-1">Telefon (11 Hane)</label>
                    <div className="relative group">
                         <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                         <input 
                           name="phone"
                           type="text"
                           value={phoneVal}
                           onChange={handlePhoneChange}
                           placeholder="05XX XXX XX XX"
                           className="w-full h-11 bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-mono"
                        />
                    </div>
                </div>

                {/* 4. Hakkımda */}
                <div className="space-y-2 relative z-10">
                    <label className="text-sm font-medium text-slate-300 ml-1">Hakkımda</label>
                    <div className="relative group">
                         <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                         <Textarea 
                           name="about"
                           defaultValue={user.about || ""}
                           placeholder="Kendinizden kısaca bahsedin..."
                           className="min-h-[120px] bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y"
                        />
                    </div>
                </div>

                <div className="pt-4 relative z-10">
                    <Button 
                        type="submit" 
                        disabled={isPending}
                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            "Kaydediliyor..."
                        ) : (
                            <>
                                <Save size={18} /> Değişiklikleri Kaydet
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
                            className={`p-4 rounded-xl flex items-center gap-3 relative z-10 ${
                                message.type === "success" 
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                                : "bg-red-500/10 border border-red-500/20 text-red-400"
                            }`}
                        >
                            {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

            </form>
         </div>
      </div>
  );
}
