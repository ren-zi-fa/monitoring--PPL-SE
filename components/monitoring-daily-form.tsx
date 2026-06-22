import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { MonitoringForm } from "@/lib/schema";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save } from "lucide-react";

interface MonitoringDailyFormProps {
  form: UseFormReturn<MonitoringForm>;
}

export function MonitoringDailyForm({ form }: MonitoringDailyFormProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const monitoringList = form.watch("monitoring") || [];

  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const targetDate = selectedDate || today;

    if (!selectedDate) {
      setSelectedDate(targetDate);
    }

    const exists = monitoringList.some((m) => m.date === targetDate);
    if (!exists) {
      form.setValue("monitoring", [
        ...monitoringList,
        { date: targetDate, sudahDidata: 0, belumSubmit: 0, sudahSubmit: 0 },
      ]);
    }
  }, [selectedDate, monitoringList, form]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const currentIndex = monitoringList.findIndex((m) => m.date === selectedDate);
  const index = currentIndex >= 0 ? currentIndex : 0;

  if (monitoringList.length === 0 || !selectedDate) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        Menyiapkan formulir...
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-2 space-y-6 ">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="space-y-1 w-full md:w-auto flex-1">
            <FormLabel className="text-slate-700 dark:text-slate-300">Pilih Tanggal Monitoring</FormLabel>
            <Input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="bg-slate-50 dark:bg-slate-900 w-full md:max-w-[250px] focus-visible:ring-blue-500"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 text-left md:text-right">
            Anda sedang mengisi data untuk tanggal: <br/>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <FormField
            control={form.control}
            name={`monitoring.${index}.sudahDidata`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-slate-300">Sudah Didata</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    className="bg-slate-50 dark:bg-slate-900 focus-visible:ring-blue-500 text-lg py-6"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`monitoring.${index}.belumSubmit`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-slate-300">Belum Submit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    className="bg-slate-50 dark:bg-slate-900 focus-visible:ring-amber-500 text-lg py-6"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`monitoring.${index}.sudahSubmit`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-slate-300">Sudah Submit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    className="bg-slate-50 dark:bg-slate-900 focus-visible:ring-emerald-500 text-lg py-6"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-end gap-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              form.setValue(`monitoring.${index}.sudahDidata`, 0, { shouldDirty: true });
              form.setValue(`monitoring.${index}.belumSubmit`, 0, { shouldDirty: true });
              form.setValue(`monitoring.${index}.sudahSubmit`, 0, { shouldDirty: true });
            }}
            className="w-full md:w-auto py-6 px-8 text-base"
          >
            Bersihkan
          </Button>
          <Button 
            type="submit" 
            className="w-full md:w-auto py-6 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-5 h-5 mr-2" />
            {(monitoringList[index]?.sudahDidata > 0 || monitoringList[index]?.belumSubmit > 0 || monitoringList[index]?.sudahSubmit > 0) ? "Perbarui Data (Edit)" : "Kirim Data"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
