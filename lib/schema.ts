import { z } from "zod";

export const monitoringDailySchema = z
  .object({
    date: z.string(),
    sudahDidata: z.coerce.number({ invalid_type_error: "Harus berupa angka" }).min(0, "Sudah Didata >= 0"),
    belumSubmit: z.coerce.number({ invalid_type_error: "Harus berupa angka" }).min(0, "Belum Submit >= 0"),
    sudahSubmit: z.coerce.number({ invalid_type_error: "Harus berupa angka" }).min(0, "Sudah Submit >= 0"),
  })
  .superRefine((data, ctx) => {
    if (data.sudahSubmit > data.sudahDidata) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sudah Submit tidak boleh melebihi Sudah Didata",
        path: ["sudahSubmit"],
      });
    }
    if (data.belumSubmit > data.sudahDidata) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Belum Submit tidak boleh melebihi Sudah Didata",
        path: ["belumSubmit"],
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
