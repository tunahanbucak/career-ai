"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataCardProps { 
  title: string; 
  children: React.ReactNode; 
  total: number; 
  page: number; 
  pageSize: number; 
  query: string;
  accentColor?: string;
}

export function DataCard({ title, children, total, page, pageSize, query, accentColor = "indigo" }: DataCardProps) {
  const totalPages = Math.ceil(total / pageSize);
  
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl overflow-hidden min-h-[400px]">
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/30">
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
            <span className={`w-1 h-5 rounded-full bg-${accentColor}-500 shadow-[0_0_10px_rgba(var(--${accentColor}-500),0.5)]`} />
            {title}
        </h3>
        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800 tracking-wider">Total: {total}</span>
      </div>
      
      <div className="overflow-x-auto flex-1">
        {children}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/50 px-4 py-3">
         <div className="text-xs font-mono text-slate-500">
            PAGE {page} / {totalPages || 1}
         </div>
         <div className="flex gap-2">
            {page > 1 && (
               <a
               href={`/admin?q=${query}&page=${page - 1}`}
               className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
               >
               <ChevronLeft size={14} />
               </a>
            )}
            {page < totalPages && (
               <a
               href={`/admin?q=${query}&page=${page + 1}`}
               className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
               >
               <ChevronRight size={14} />
               </a>
            )}
         </div>
      </div>
    </div>
  );
}

export function AdminTable({ children }: { children: React.ReactNode }) {
    return (
        <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/80 border-b border-slate-800 tracking-wider">
               {children}
            </thead>
            {/* Body will be passed as sibling in usage or strictly structured, here we assume header is passed as child for Thead and body is sibling. 
                Wait, standard structure is Table -> Thead -> Tr -> Th, Tbody -> Tr -> Td.
                Let's make this component just the table wrapper.
            */}
        </table>
    )
}

// Exports for direct use in page.tsx to keep it cleaner
// Actually, I'll export just the DataCard and let page.tsx handle the table content structure 
// because the columns differ for each table.
