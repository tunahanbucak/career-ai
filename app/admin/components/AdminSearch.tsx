import { Search, Download } from "lucide-react";

interface AdminSearchProps {
  query: string;
}

export default function AdminSearch({ query }: AdminSearchProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-1">
      <div className="flex flex-col lg:flex-row justify-between items-center bg-slate-950/50 rounded-xl p-4 gap-4">
        <form
          action="/admin"
          method="get"
          className="flex-1 w-full flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Veritabanında ara (Email, ID, Başlık)..."
              className="w-full h-11 rounded-lg border border-slate-700 bg-slate-900 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
            />
          </div>
          <input type="hidden" name="page" value="1" />
          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
          >
            ARA
          </button>
          {query && (
            <a
              href="/admin"
              className="flex items-center justify-center px-4 h-11 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Reset
            </a>
          )}
        </form>
        <div className="w-full lg:w-auto flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-4">
          <form
            action="/api/admin/export"
            method="get"
            className="flex items-center gap-2"
          >
            <select
              name="type"
              className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="analyses">Analizler</option>
              <option value="cvs">CV&apos;ler</option>
            </select>
            <button
              type="submit"
              className="h-9 px-3 flex items-center gap-2 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
            >
              <Download size={14} /> CSV
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
