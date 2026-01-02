"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Search, ArrowRight, Clock, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface InterviewItem {
  id: string;
  position: string;
  date: string | Date;
  isCompleted: boolean;
  score: number | null;
  _count: { messages: number };
}

interface InterviewHistoryListProps {
  interviews: InterviewItem[];
}

export default function InterviewHistoryList({
  interviews,
}: InterviewHistoryListProps) {
  const [term, setTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<string | null>(null);

  const filtered = interviews.filter((item) =>
    (item.position.toLowerCase() || "").includes(term.toLowerCase())
  );

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setInterviewToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!interviewToDelete) return;

    setDeletingId(interviewToDelete);
    setDeleteDialogOpen(false);
    
    try {
      const { deleteInterview } = await import("@/app/actions/delete");
      const result = await deleteInterview(interviewToDelete);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Mülakat başarıyla silindi.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Bir hata oluştu.");
    } finally {
      setDeletingId(null);
      setInterviewToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
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
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
          <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">Sonuç bulunamadı.</p>
          <p className="text-slate-600 text-sm">
            Arama teriminizi değiştirmeyi deneyin.
          </p>
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
              return (
                <motion.div 
                    key={it.id} 
                    variants={item} 
                    layout
                    className={deletingId === it.id ? "opacity-50 pointer-events-none" : ""}
                >
                  <Link
                    href={`/me/interviews/${it.id}`}
                    className="group block h-full"
                  >
                    <div className="group relative h-full bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col">
                      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                          <MessageSquare size={24} />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge
                            variant="outline"
                            className={`
                                        border font-normal
                                        ${
                                        it.isCompleted
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        }
                                    `}
                            >
                            {it.isCompleted ? "Analiz Edildi" : "Yarım Kaldı"}
                            </Badge>
                             <button
                                onClick={(e) => handleDeleteClick(e, it.id)}
                                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-rose-500/20 hover:text-rose-400 transition-all z-20"
                                title="Sil"
                              >
                                {deletingId === it.id ? (
                                    <div className="h-4 w-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {it.position}
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                          {new Date(it.date).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 flex flex-col items-center justify-center">
                            <span className="text-xs text-slate-500">
                              Mesaj
                            </span>
                            <span className="text-sm font-bold text-slate-200">
                              {it._count.messages}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 flex flex-col items-center justify-center">
                            <span className="text-xs text-slate-500">Puan</span>
                            <span
                              className={`text-sm font-bold ${
                                it.score !== null ? "text-emerald-400" : "text-slate-400"
                              }`}
                            >
                              {it.score !== null ? it.score : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                        <span>Detayları Gör</span>
                        <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mülakatı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu mülakat oturumunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
