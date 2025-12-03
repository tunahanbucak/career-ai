import { Bot, Briefcase, ChevronDown, RotateCcw } from "lucide-react";
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
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="text-indigo-500" /> Mülakat Simülatörü
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Yapay zeka ile gerçekçi bir teknik mülakat deneyimi yaşa.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Briefcase className="h-4 w-4 text-slate-400" />
          </div>
          <select
            className="h-10 w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-8 text-sm text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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

        {canReset && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-red-950 hover:text-red-400 hover:border-red-900"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Bitir
          </Button>
        )}
      </div>
    </header>
  );
}
