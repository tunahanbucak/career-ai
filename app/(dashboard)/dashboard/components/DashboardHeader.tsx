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
      className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
    >
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary/80 to-primary pb-2">
          Kontrol Paneli
        </h1>
        <p className="text-muted-foreground mt-1 text-base font-medium">
          Hoş geldin,{" "}
          <span className="text-primary font-bold glow-text">
            {displayName}
          </span>
          . Bugün kariyerinde bir adım daha ileri gidelim.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleSupport}
          className="border-border bg-secondary/50 backdrop-blur-sm hover:bg-secondary text-foreground transition-all hover:border-primary/20"
        >
          <AlertCircle className="mr-2 h-4 w-4" /> Destek
        </Button>
        <Button
          onClick={handleNewAnalysis}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40 border border-primary/50"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Yeni Analiz
        </Button>
      </div>
    </motion.header>
  );
}
