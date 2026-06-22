import { z } from "zod";

const monitoringDailySchema = z
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

const data = {
    date: "2023-10-10",
    sudahDidata: 8,
    belumSubmit: 0,
    sudahSubmit: 8
};

const result = monitoringDailySchema.safeParse(data);
console.log(JSON.stringify(result, null, 2));
