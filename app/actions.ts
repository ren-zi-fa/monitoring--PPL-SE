"use server";

import { db } from "@/lib/prisma";
import { MonitoringForm } from "@/lib/schema";

export async function saveMonitoringAction(data: MonitoringForm) {
  try {
    // Pastikan MonitoringTarget sudah ada di database untuk mencegah Foreign Key Error
    await db.monitoringTarget.upsert({
      where: { idsubsls: data.idsubsls },
      update: {
        ppl: data.ppl,
        desa: data.desa,
        sls: data.sls,
      },
      create: {
        idsubsls: data.idsubsls,
        ppl: data.ppl,
        desa: data.desa,
        sls: data.sls,
      },
    });

    for (const daily of data.monitoring) {
      // Upsert based on idsubsls + date
      await db.monitoringDaily.upsert({
        where: {
          idsubsls_date: {
            idsubsls: data.idsubsls,
            date: new Date(daily.date),
          },
        },
        update: {
          sudahDidata: daily.sudahDidata,
          belumSubmit: daily.belumSubmit,
          sudahSubmit: daily.sudahSubmit,
        },
        create: {
          idsubsls: data.idsubsls,
          date: new Date(daily.date),
          sudahDidata: daily.sudahDidata,
          belumSubmit: daily.belumSubmit,
          sudahSubmit: daily.sudahSubmit,
        },
      });
    }
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save to db", error);
    return { success: false, message: error.message };
  }
}

export async function getMonitoringDataAction(idsubsls: string) {
  const target = await db.monitoringTarget.findUnique({
    where: { idsubsls },
    include: {
      monitoring: {
        orderBy: { date: "asc" }
      }
    }
  });

  if (!target) return null;

  return {
    idsubsls: target.idsubsls,
    ppl: target.ppl,
    desa: target.desa,
    sls: target.sls,
    monitoring: target.monitoring.map(m => ({
      date: m.date.toISOString().split("T")[0],
      sudahDidata: m.sudahDidata,
      belumSubmit: m.belumSubmit,
      sudahSubmit: m.sudahSubmit,
    })),
  };
}

export async function getPplSummaryAction(ppl: string) {
  const targets = await db.monitoringTarget.findMany({
    where: { ppl },
    include: {
      monitoring: true
    }
  });

  let totalSudahDidata = 0;
  let totalBelumSubmit = 0;
  let totalSudahSubmit = 0;

  for (const target of targets) {
    for (const m of target.monitoring) {
      totalSudahDidata += m.sudahDidata;
      totalBelumSubmit += m.belumSubmit;
      totalSudahSubmit += m.sudahSubmit;
    }
  }

  return {
    totalSudahDidata,
    totalBelumSubmit,
    totalSudahSubmit
  };
}
