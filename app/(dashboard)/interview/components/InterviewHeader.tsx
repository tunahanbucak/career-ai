import { Bot, ChevronDown, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  position: string;
  setPosition: (value: string) => void;
  canReset: boolean;
  onReset: () => void;
};

export default function InterviewHeader({
  position,
  setPosition,
  canReset,
  onReset,
}: Props) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md shadow-lg">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="h-7 w-7 text-white" />
        </div>
        <div>
           <div className="flex items-center gap-2 mb-1">
             <h1 className="text-xl font-bold text-white tracking-tight">AI Mülakat Simülatörü</h1>
             <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Canlı</div>
           </div>
           
           <p className="text-sm text-slate-400">
             Gerçekçi teknik mülakat deneyimi ile yeteneklerini test et.
           </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group min-w-[200px]">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
               <Sparkles className="h-4 w-4 text-indigo-400" />
             </div>
             <select
               className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-10 text-sm font-medium text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all hover:border-slate-600"
               value={position}
               onChange={(e) => setPosition(e.target.value)}
               disabled={canReset}
             >
               <option>Frontend Developer</option>
               <option>Backend Developer</option>
               <option>Fullstack Developer</option>
               <option>Data Scientist</option>
               <option>Mobile Developer</option>
               <option>DevOps Engineer</option>
               <option>UI/UX Designer</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
               <ChevronDown className="h-4 w-4 text-slate-500" />
             </div>
          </div>
        </div>

        {canReset && (
          <Button
            variant="outline"
            onClick={onReset}
            className="h-11 border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-red-950/50 hover:text-red-400 hover:border-red-900/50 transition-colors"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Bitir
          </Button>
        )}
      </div>
    </header>
  );
}
