"use client";

import { useSession } from "next-auth/react";
import { AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Props = {
  userName?: string | null;
};

export default function DashboardHeader({ userName }: Props) {
  const { data: session } = useSession();

  const displayName = userName || session?.user?.name || "Kullanıcı";

  const handleSupport = () => {
    window.location.href = "mailto:destek@careerai.com?subject=Yardım Talebi";
  };

  const handleNewAnalysis = () => {
    window.location.href = "/me/cvs";
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 relative"
    >
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-10 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          Hoş Geldin,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
            {displayName}
          </span>
          👋
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
          Kariyer yolculuğun burada şekilleniyor. CV analizlerini incele,
          mülakat yeteneklerini geliştir ve hedefine ulaş.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleSupport}
          size="lg"
          className="rounded-2xl border-border bg-background/50 backdrop-blur-xl hover:bg-secondary/80 text-foreground transition-all duration-300 hover:shadow-lg shadow-sm font-semibold"
        >
          <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground" /> Destek
        </Button>
        <Button
          onClick={handleNewAnalysis}
          size="lg"
          className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 font-bold border-0"
        >
          <Sparkles className="mr-2 h-5 w-5 animate-pulse" /> Yeni Analiz
        </Button>
      </div>
    </motion.header>
  );
}
