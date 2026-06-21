"use server";

import { db } from "@/lib/prisma";

export async function getRekapData() {
  const allMonitoring = await db.monitoringDaily.findMany({
    include: {
      target: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const aggregated: Record<string, { sudahDidata: number; belumSubmit: number; sudahSubmit: number; wilayah: string[] }> = {};
  
  const rawData = allMonitoring.map((m) => {
    const dString = m.date.toISOString().split("T")[0];
    
    if (!aggregated[dString]) {
      aggregated[dString] = { sudahDidata: 0, belumSubmit: 0, sudahSubmit: 0, wilayah: [] };
    }
    aggregated[dString].sudahDidata += m.sudahDidata;
    aggregated[dString].belumSubmit += m.belumSubmit;
    aggregated[dString].sudahSubmit += m.sudahSubmit;

    // Tambahkan nama SLS ke daftar wilayah jika belum ada
    if (!aggregated[dString].wilayah.includes(m.target.sls)) {
      aggregated[dString].wilayah.push(m.target.sls);
    }

    return {
      Tanggal: dString,
      IDSUBSLS: m.idsubsls,
      PPL: m.target.ppl,
      Desa: m.target.desa,
      SLS: m.target.sls,
      "Sudah Didata": m.sudahDidata,
      "Belum Submit": m.belumSubmit,
      "Sudah Submit": m.sudahSubmit,
    };
  });

  return { aggregated, rawData };
}
