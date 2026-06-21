import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MonitoringForm } from "@/lib/schema";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { saveMonitoringAction, getMonitoringDataAction } from "@/app/actions";
export const TARGET_DATA = [
  { idsubsls: "1312080004000601", ppl: "Ade Sunarsih, A.Md.", desa: "LINGKUANG AUA TIMUR", sls: "JORONG KAMPUANG CUBADAK" },
  { idsubsls: "1312080004000602", ppl: "Ade Sunarsih, A.Md.", desa: "LINGKUANG AUA TIMUR", sls: "JORONG KAMPUANG CUBADAK" },
  { idsubsls: "1312080004000603", ppl: "Ade Sunarsih, A.Md.", desa: "LINGKUANG AUA TIMUR", sls: "JORONG KAMPUANG CUBADAK" },
  { idsubsls: "1312080004000604", ppl: "Ade Sunarsih, A.Md.", desa: "LINGKUANG AUA TIMUR", sls: "JORONG KAMPUANG CUBADAK" },
  { idsubsls: "1312080013000401", ppl: "Dela monica", desa: "LUBUAK LANDUA AUA KUNIANG", sls: "LUBUAK LANDUA AUA KUNIANG" },
  { idsubsls: "1312080013000402", ppl: "Dela monica", desa: "LUBUAK LANDUA AUA KUNIANG", sls: "JORONG LUBUAK LANDUA" },
  { idsubsls: "1312080013000403", ppl: "Dela monica", desa: "LUBUAK LANDUA AUA KUNIANG", sls: "JORONG LUBUAK LANDUA" },
  { idsubsls: "1312080013000404", ppl: "Dela monica", desa: "LUBUAK LANDUA AUA KUNIANG", sls: "JORONG LUBUAK LANDUA" },
  { idsubsls: "1312080002000301", ppl: "Hanifa Difina", desa: "AUA KUNIANG", sls: "JORONG GUGUAK TIGO TALAO" },
  { idsubsls: "1312080002000302", ppl: "Hanifa Difina", desa: "AUA KUNIANG", sls: "JORONG GUGUAK TIGO TALAO" },
  { idsubsls: "1312080002000401", ppl: "Hanifa Difina", desa: "AUA KUNIANG", sls: "JORONG JAMBU BARU" },
  { idsubsls: "1312080002000402", ppl: "Hanifa Difina", desa: "AUA KUNIANG", sls: "JORONG JAMBU BARU" },
  { idsubsls: "1312080005000505", ppl: "Kusnadi", desa: "LINGKUANG AUA BARU", sls: "JORONG RIMBO JANDUANG" },
  { idsubsls: "1312080005000506", ppl: "Kusnadi", desa: "LINGKUANG AUA BARU", sls: "JORONG RIMBO JANDUANG" },
  { idsubsls: "1312080005000507", ppl: "Kusnadi", desa: "LINGKUANG AUA BARU", sls: "JORONG RIMBO JANDUANG" },
  { idsubsls: "1312080015000503", ppl: "Kusnadi", desa: "AIA GADANG TIMUR", sls: "JORONG BATANG LINGKIN TIMUR" },
  { idsubsls: "1312080002000501", ppl: "rafif shidqi al ghani", desa: "AUA KUNIANG", sls: "JORONG KOTO ALAM PADANG BULI-BULI" },
  { idsubsls: "1312080002000502", ppl: "rafif shidqi al ghani", desa: "AUA KUNIANG", sls: "JORONG KOTO ALAM PADANG BULI-BULI" },
  { idsubsls: "1312080002000503", ppl: "rafif shidqi al ghani", desa: "AUA KUNIANG", sls: "JORONG KOTO ALAM PADANG BULI-BULI" },
  { idsubsls: "1312080002000504", ppl: "rafif shidqi al ghani", desa: "AUA KUNIANG", sls: "JORONG KOTO ALAM PADANG BULI-BULI" },
  { idsubsls: "1312080013000501", ppl: "Sakina Fitriyani", desa: "LUBUAK LANDUA AUA KUNIANG", sls: "JORONG KAMPUANG BARU" },
  { idsubsls: "1312080013000502", ppl: "Sakina Fitriyani", desa: "LUBUAK LANDUA AUA KUNIANG", sls: "JORONG KAMPUANG BARU" },
  { idsubsls: "1312080013000503", ppl: "Sakina Fitriyani", desa: "LUBUAK LANDUA AUA KUNIANG", sls: "JORONG KAMPUANG BARU" },
  { idsubsls: "1312080013000600", ppl: "Sakina Fitriyani", desa: "LUBUAK LANDUA AUA KUNIANG", sls: "JORONG LADANG RIMBO" },
  { idsubsls: "1312080002000403", ppl: "Yodrial karoz", desa: "AUA KUNIANG", sls: "JORONG JAMBU BARU" },
  { idsubsls: "1312080005000701", ppl: "Yodrial karoz", desa: "LINGKUANG AUA BARU", sls: "JORONG PASAMAN BARU UTARA" },
  { idsubsls: "1312080005000703", ppl: "Yodrial karoz", desa: "LINGKUANG AUA BARU", sls: "JORONG PASAMAN BARU UTARA" }
];

export const UNIQUE_PPLS = Array.from(new Set(TARGET_DATA.map(d => d.ppl)));

export function useMonitoringData(idsubsls: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["monitoring", idsubsls],
    queryFn: async (): Promise<MonitoringForm | null> => {
      if (!idsubsls) return null;
      
      const target = TARGET_DATA.find(t => t.idsubsls === idsubsls);
      if (!target) return null;

      // Coba ambil dari DB
      const dbData = await getMonitoringDataAction(idsubsls);
      
      if (dbData) {
        return dbData as MonitoringForm;
      }

      // Jika kosong, kembalikan dengan monitoring kosong (akan diisi otomatis oleh form untuk hari ini)
      return {
        idsubsls: target.idsubsls,
        ppl: target.ppl,
        desa: target.desa,
        sls: target.sls,
        monitoring: [],
      };
    },
    enabled: !!idsubsls,
  });

  const mutation = useMutation({
    mutationFn: async (data: MonitoringForm) => {
      const res = await saveMonitoringAction(data);
      if (!res.success) throw new Error(res.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["monitoring", data.idsubsls], data);
      toast.success("Data monitoring berhasil disimpan");
    },
    onError: () => {
      toast.error("Gagal menyimpan data monitoring");
    },
  });

  return { query, mutation };
}
