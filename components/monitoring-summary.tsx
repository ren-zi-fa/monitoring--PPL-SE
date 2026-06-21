import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getPplSummaryAction } from "@/app/actions";
import { Loader2 } from "lucide-react";

interface MonitoringSummaryProps {
  pplName: string;
}

export function MonitoringSummary({ pplName }: MonitoringSummaryProps) {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["ppl-summary", pplName],
    queryFn: () => getPplSummaryAction(pplName),
    enabled: !!pplName && pplName !== "-",
  });

  const totalSudahDidata = summary?.totalSudahDidata || 0;
  const totalBelumSubmit = summary?.totalBelumSubmit || 0;
  const totalSudahSubmit = summary?.totalSudahSubmit || 0;

  const belumSubmitPercentage = totalSudahDidata > 0 ? Math.round((totalBelumSubmit / totalSudahDidata) * 100) : 0;
  const sudahSubmitPercentage = totalSudahDidata > 0 ? Math.round((totalSudahSubmit / totalSudahDidata) * 100) : 0;

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Memuat ringkasan PPL...
      </div>
    );
  }

  if (!pplName || pplName === "-") {
    return (
      <div className="py-12 text-center text-slate-500">
        Silakan pilih PPL terlebih dahulu untuk melihat ringkasan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-slate-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Sudah Didata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalSudahDidata}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Belum Submit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{totalBelumSubmit}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Sudah Submit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{totalSudahSubmit}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Pencapaian</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Belum Submit thd Sudah Didata</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  {belumSubmitPercentage}%
                </Badge>
              </div>
              <span className="text-sm text-slate-500">{totalBelumSubmit} / {totalSudahDidata}</span>
            </div>
            <Progress value={belumSubmitPercentage} className="h-2 bg-slate-100 dark:bg-slate-800 [&_[data-slot=progress-indicator]]:bg-amber-500" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sudah Submit thd Sudah Didata</span>
                <Badge variant={sudahSubmitPercentage >= 100 ? "default" : "secondary"} className={sudahSubmitPercentage >= 100 ? "bg-emerald-600" : ""}>
                  {sudahSubmitPercentage}%
                </Badge>
              </div>
              <span className="text-sm text-slate-500">{totalSudahSubmit} / {totalSudahDidata}</span>
            </div>
            <Progress value={sudahSubmitPercentage} className="h-2 bg-slate-100 dark:bg-slate-800 [&_[data-slot=progress-indicator]]:bg-emerald-500" />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
