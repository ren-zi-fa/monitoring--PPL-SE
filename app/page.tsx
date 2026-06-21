"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MonitoringForm, monitoringFormSchema } from "@/lib/schema";
import { useMonitoringData } from "@/hooks/use-monitoring-data";

import { MonitoringHeader } from "@/components/monitoring-header";
import { MonitoringFilter } from "@/components/monitoring-filter";
import { MonitoringInfoCard } from "@/components/monitoring-info-card";
import { MonitoringDailyForm } from "@/components/monitoring-daily-form";
import { MonitoringSummary } from "@/components/monitoring-summary";
import { MonitoringSkeleton } from "@/components/monitoring-skeleton";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function MonitoringPage() {
  const [activeIdsubsls, setActiveIdsubsls] = useState<string>("subsls-init");
  
  const { query, mutation } = useMonitoringData(activeIdsubsls);

  const form = useForm<MonitoringForm>({
    resolver: zodResolver(monitoringFormSchema),
    defaultValues: {
      idsubsls: "",
      ppl: "",
      desa: "",
      sls: "",
      monitoring: [],
    },
  });

  // Effect to reset form when data changes
  useEffect(() => {
    if (query.data) {
      form.reset(query.data);
    }
  }, [query.data, form]);

  // Auto save draft logic
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Auto save on change (in real app, use debouncing)
      if (type === "change" && name?.startsWith("monitoring")) {
        // Simulating autosave draft to localstorage or minor api hit
        console.log("Draft saved...", value);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSearch = (idsubsls: string) => {
    setActiveIdsubsls(idsubsls);
  };

  const onSubmit = (data: MonitoringForm) => {
    mutation.mutate(data);
  };

  const handleReset = () => {
    if (query.data) {
      form.reset(query.data);
      toast.success("Data dikembalikan ke posisi awal");
    }
  };

  // Resolve names for Info Card
  const pplName = form.watch("ppl") || "-";
  const desaName = form.watch("desa") || "-";
  const slsName = form.watch("sls") || "-";

  const onError = (errors: any) => {
    console.log("Validation errors:", errors);
    toast.error("Validasi gagal. Pastikan semua filter telah dipilih dan nilai tidak kurang dari 0.");
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
      <MonitoringHeader 
        onSave={form.handleSubmit(onSubmit, onError)} 
        isSaving={mutation.isPending}
      />

      <MonitoringFilter onSearch={handleSearch} />

      {!activeIdsubsls || activeIdsubsls === "subsls-init" ? (
        <div className="py-16 text-center bg-white dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 8H20" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Pilih Wilayah Tugas</h3>
          <p className="mt-2 text-slate-500 max-w-sm mx-auto">Silakan pilih PPL dan Wilayah Tugas pada filter di atas terlebih dahulu untuk mulai mengisi formulir harian atau melihat ringkasan.</p>
        </div>
      ) : query.isLoading ? (
        <MonitoringSkeleton />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
            <MonitoringInfoCard 
              pplName={pplName}
              desaName={desaName}
              slsName={slsName}
              idsubsls={form.watch("idsubsls") || "-"}
            />

            <Tabs defaultValue="harian" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                <TabsTrigger value="harian">Monitoring Harian</TabsTrigger>
                <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
              </TabsList>
              
              <div className="mt-6 bg-white dark:bg-slate-950 rounded-xl p-1 shadow-sm border border-slate-100 dark:border-slate-800">
                <TabsContent value="harian" className="m-0 p-4 outline-none focus-visible:ring-0">
                  <MonitoringDailyForm form={form} />
                </TabsContent>
                
                <TabsContent value="ringkasan" className="m-0 p-4 outline-none focus-visible:ring-0">
                  <MonitoringSummary pplName={pplName} />
                </TabsContent>
              </div>
            </Tabs>
          </form>
        </Form>
      )}
    </div>
  );
}
