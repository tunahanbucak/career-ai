"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Search, ArrowRight, Clock, MessageCircle, BarChart, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface InterviewItem {
  id: string;
  position: string;
  date: string | Date;
  _count: { messages: number };
}

interface InterviewHistoryListProps {
  interviews: InterviewItem[];
}

export default function InterviewHistoryList({ interviews }: InterviewHistoryListProps) {
  const [term, setTerm] = useState("");

  const filtered = interviews.filter(item => 
    (item.position.toLowerCase() || "").includes(term.toLowerCase())
  );

  // Mock function to generate consistent score based on ID
  const getMockScore = (id: string, count: number) => {
    if (count < 5) return null; // Not enough data
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 30) + 70; // Score between 70-100
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-1 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
         <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <input 
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Pozisyon adı ile ara..."
              className="w-full h-12 bg-transparent text-sm text-slate-200 pl-11 pr-4 focus:outline-none placeholder:text-slate-600 rounded-xl"
            />
         </div>
         <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-800 w-full sm:w-auto justify-center sm:justify-start">
            <Clock className="h-3 w-3" />
            <span>{filtered.length} Kayıt</span>
         </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
           <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-slate-600" />
           </div>
           <p className="text-slate-400 font-medium">Sonuç bulunamadı.</p>
           <p className="text-slate-600 text-sm">Arama teriminizi değiştirmeyi deneyin.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
           <AnimatePresence mode="popLayout">
             {filtered.map((it) => {
               const score = getMockScore(it.id, it._count.messages);
               const isCompleted = it._count.messages > 5;
               
               return (
               <motion.div
                 key={it.id}
                 variants={item}
                 layout
               >
                 <Link href={`/me/interviews/${it.id}`} className="group block h-full">
                    <div className="group relative h-full bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col">
                       
                       {/* Decoration */}
                       <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />

                       {/* Header */}
                       <div className="flex justify-between items-start mb-4 relative z-10">
                           <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                               <MessageSquare size={24} />
                           </div>
                           <Badge 
                                variant="outline" 
                                className={`
                                    border font-normal
                                    ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}
                                `}
                           >
                               {isCompleted ? "Tamamlandı" : "Yarım Kaldı"}
                           </Badge>
                       </div>

                       {/* Content */}
                       <div className="flex-1">
                           <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                               {it.position}
                           </h3>
                           <p className="text-xs text-slate-500 mb-4">
                               {new Date(it.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                           </p>

                           {/* Metrics */}
                           <div className="grid grid-cols-2 gap-2 mb-4">
                               <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 flex flex-col items-center justify-center">
                                    <span className="text-xs text-slate-500">Mesaj</span>
                                    <span className="text-sm font-bold text-slate-200">{it._count.messages}</span>
                               </div>
                               <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 flex flex-col items-center justify-center">
                                    <span className="text-xs text-slate-500">Puan</span>
                                    <span className={`text-sm font-bold ${score ? 'text-emerald-400' : 'text-slate-400'}`}>
                                        {score ? `%${score}` : '-'}
                                    </span>
                               </div>
                           </div>
                       </div>

                       {/* Action */}
                       <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                           <span>Detayları Gör</span>
                           <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                <ArrowRight size={12} />
                           </div>
                       </div>
                    </div>
                 </Link>
               </motion.div>
             )})}
           </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
