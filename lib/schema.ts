import { z } from "zod";

export const monitoringDailySchema = z
  .object({
    date: z.string(),
    sudahDidata: z.number({ invalid_type_error: "Harus berupa angka" }).min(0, "Sudah Didata >= 0"),
    belumSubmit: z.number({ invalid_type_error: "Harus berupa angka" }).min(0, "Belum Submit >= 0"),
    sudahSubmit: z.number({ invalid_type_error: "Harus berupa angka" }).min(0, "Sudah Submit >= 0"),
  })
  .superRefine((data, ctx) => {
    if (data.sudahSubmit + data.belumSubmit > data.sudahDidata) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total submit tidak boleh melebihi Sudah Didata",
        path: ["sudahSubmit"],
      });
    }
  });

export const monitoringFormSchema = z.object({
  idsubsls: z.string().min(1, "IDSUBSLS wajib diisi"),
  ppl: z.string().min(1, "PPL wajib diisi"),
  desa: z.string().min(1, "Desa wajib diisi"),
  sls: z.string().min(1, "SLS wajib diisi"),
  monitoring: z.array(monitoringDailySchema),
});

export type MonitoringDaily = z.infer<typeof monitoringDailySchema>;
export type MonitoringForm = z.infer<typeof monitoringFormSchema>;
