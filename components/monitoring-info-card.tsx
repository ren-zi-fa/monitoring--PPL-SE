import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, Map, Hash } from "lucide-react";

interface MonitoringInfoCardProps {
  pplName: string;
  desaName: string;
  slsName: string;
  idsubsls: string;
}

export function MonitoringInfoCard({
  pplName,
  desaName,
  slsName,
  idsubsls,
}: MonitoringInfoCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nama PPL</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{pplName}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full text-emerald-600 dark:text-emerald-300">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nama Desa</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{desaName}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full text-amber-600 dark:text-amber-300">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nama SLS</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{slsName}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-300">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">ID SUBSLS</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{idsubsls}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
