"use client";

import { useEffect, useState } from "react";
import { getRekapData } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ChevronLeft, ChevronRight, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { TARGET_DATA } from "@/hooks/use-monitoring-data";
import { 
  addMonths, 
  subMonths, 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isToday
} from "date-fns";
import { id } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type AggregatedData = Record<string, { sudahDidata: number; belumSubmit: number; sudahSubmit: number; wilayah: string[] }>;

export default function RekapPage() {
  const [data, setData] = useState<{ aggregated: AggregatedData; rawData: any[] }>({ aggregated: {}, rawData: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Start at June 2026

  useEffect(() => {
    getRekapData().then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  const handleExport = () => {
    if (data.rawData.length === 0) {
      alert("Tidak ada data untuk diexport. Silakan isi form harian terlebih dahulu.");
      return;
    }

    const wsData: any[][] = [];
    
    // Cari semua tanggal unik yang ada datanya
    const uniqueDates = Array.from(new Set(data.rawData.map(d => d.Tanggal))).sort();
    
    // Baris 1: Header Utama
    const row1 = ["No", "idsubsls", "PPL", "nmdesa", "nmsls"];
    uniqueDates.forEach(d => {
        row1.push(d); // Tanggal
        row1.push(""); // Kosong untuk cell merge
        row1.push(""); // Kosong untuk cell merge
    });
    row1.push("Total (Akumulasi)");
    wsData.push(row1);

    // Baris 2: Sub-header Status
    const row2 = ["", "", "", "", ""];
    uniqueDates.forEach(() => {
        row2.push("Open (Sudah Didata)");
        row2.push("Submit (Belum Submit)");
        row2.push("Approve (Sudah Submit)");
    });
    row2.push("");
    wsData.push(row2);

    // Baris 3 dst: Isi Data PPL (semua PPL dari TARGET_DATA)
    TARGET_DATA.forEach((target, index) => {
        const row: any[] = [
            index + 1,
            target.idsubsls,
            target.ppl,
            target.desa,
            target.sls,
        ];
        
        let rowTotal = 0;
        
        uniqueDates.forEach(d => {
            const record = data.rawData.find(r => r.IDSUBSLS === target.idsubsls && r.Tanggal === d);
            if (record) {
                row.push(record["Sudah Didata"]);
                row.push(record["Belum Submit"]);
                row.push(record["Sudah Submit"]);
                rowTotal += record["Sudah Didata"]; // Asumsi total progress biasanya dihitung dari Open/Sudah Didata
            } else {
                row.push(0);
                row.push(0);
                row.push(0);
            }
        });
        
        row.push(rowTotal);
        wsData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Proses Merge Cell untuk Header Tanggal (Colspan = 3)
    const merges: XLSX.Range[] = [];
    uniqueDates.forEach((_, i) => {
        const startCol = 5 + (i * 3);
        merges.push({ s: { r: 0, c: startCol }, e: { r: 0, c: startCol + 2 } });
    });
    ws["!merges"] = merges;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap_PPL");
    XLSX.writeFile(wb, `MONITORING-FASIH-PPL_${format(new Date(), "yyyyMMdd")}.xlsx`);
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const totalSudahDidata = data.rawData.reduce((acc, curr) => acc + (curr["Sudah Didata"] || 0), 0);
  const totalBelumSubmit = data.rawData.reduce((acc, curr) => acc + (curr["Belum Submit"] || 0), 0);
  const totalSudahSubmit = data.rawData.reduce((acc, curr) => acc + (curr["Sudah Submit"] || 0), 0);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Rekap Data 
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Progress keseluruhan dari semua PPL
           
          </p>
          <p> PML : RENZI FEBRIANDIKA</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 border-border bg-background hover:bg-muted hover:text-foreground h-8 gap-1.5 px-2.5 px-4 py-2">
            <Home className="w-4 h-4 mr-2" />
            Kembali
          </Link>
          <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export ke XLSX
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Sudah Didata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 flex items-center h-9">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-blue-500" /> : totalSudahDidata}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Total Belum Submit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 flex items-center h-9">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-amber-500" /> : totalBelumSubmit}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Total Sudah Submit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 flex items-center h-9">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-500" /> : totalSudahSubmit}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">
            {format(currentDate, "MMMM yyyy", { locale: id })}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
              <div key={day} className="bg-slate-50 dark:bg-slate-900/50 py-3 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                {day}
              </div>
            ))}
            
            {calendarDays.map((day, i) => {
              const dString = format(day, "yyyy-MM-dd");
              const dayData = data.aggregated[dString];
              const isCurrentMonth = isSameMonth(day, monthStart);

              return (
                <div 
                  key={i} 
                  className={`min-h-[100px] p-2 bg-white dark:bg-slate-950 transition-colors ${
                    !isCurrentMonth ? "text-slate-300 dark:text-slate-700" : ""
                  } ${isToday(day) ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-medium ${isToday(day) ? "bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center" : ""}`}>
                      {format(day, "d")}
                    </span>
                  </div>
                  
                  {isLoading && isCurrentMonth ? (
                    <div className="h-full flex items-center justify-center mt-4">
                      <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                    </div>
                  ) : dayData && (dayData.sudahDidata > 0 || dayData.belumSubmit > 0 || dayData.sudahSubmit > 0) ? (
                    <Dialog>
                      <DialogTrigger className="w-full text-left space-y-1 mt-2 cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:ring-offset-1 rounded transition-all focus:outline-none">
                        <div className="text-xs flex justify-between bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-1 rounded">
                          <span>Didata:</span>
                          <span className="font-bold">{dayData.sudahDidata}</span>
                        </div>
                        <div className="text-xs flex justify-between bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-1 rounded">
                          <span>Belum:</span>
                          <span className="font-bold">{dayData.belumSubmit}</span>
                        </div>
                        <div className="text-xs flex justify-between bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 p-1 rounded">
                          <span>Sudah:</span>
                          <span className="font-bold">{dayData.sudahSubmit}</span>
                        </div>
                        <div className="text-[10px] text-center text-indigo-600 dark:text-indigo-400 font-medium pt-1">
                          Lihat Detail
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle>Detail Progress - {format(day, "d MMMM yyyy", { locale: id })}</DialogTitle>
                        </DialogHeader>
                        <div className="overflow-y-auto pr-2 mt-4 space-y-4">
                          {data.rawData.filter(r => r.Tanggal === dString).map((r, rIdx) => (
                            <div key={rIdx} className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{r.PPL}</p>
                                  <p className="text-xs text-slate-500">{r.IDSUBSLS} - {r.Desa} ({r.SLS})</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-2 rounded flex flex-col items-center text-center justify-center">
                                  <span className="text-[10px] opacity-80 mb-1">Sudah Didata:</span>
                                  <span className="font-bold text-lg">{r["Sudah Didata"]}</span>
                                </div>
                                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 p-2 rounded flex flex-col items-center text-center justify-center">
                                  <span className="text-[10px] opacity-80 mb-1">Belum Submit:</span>
                                  <span className="font-bold text-lg">{r["Belum Submit"]}</span>
                                </div>
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 p-2 rounded flex flex-col items-center text-center justify-center">
                                  <span className="text-[10px] opacity-80 mb-1">Sudah Submit:</span>
                                  <span className="font-bold text-lg">{r["Sudah Submit"]}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-300 dark:text-slate-700 mt-4">
                      {isCurrentMonth ? "-" : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
