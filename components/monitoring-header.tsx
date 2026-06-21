import { Button } from "@/components/ui/button";
import { Calendar, RefreshCcw, Save, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface MonitoringHeaderProps {
  onSave: () => void;
  isSaving?: boolean;
}

export function MonitoringHeader({
  onSave,
  isSaving,
}: MonitoringHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Monitoring FASIH PPL
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Periode: Juni 2026
        </p>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Link 
          href="/rekap"
          className="flex-1 md:flex-none inline-flex shrink-0 items-center justify-center rounded-lg bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 h-8 gap-1.5 px-2.5 bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Rekap Kalender
        </Link>
        {isSaving ? (
          <div className="flex-1 md:flex-none flex items-center justify-center h-8 px-3 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-200 dark:border-blue-800">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Menyimpan...
          </div>
        ) : (
          <div className="flex-1 md:flex-none flex items-center justify-center h-8 px-3 rounded-md bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-sm font-medium border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
            Tersimpan
          </div>
        )}
      </div>
    </div>
  );
}
