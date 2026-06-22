// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const TARGET_DATA = [
//   { idsubsls: "1312080002000502", ppl: "rafif shidqi al ghani", desa: "AUA KUNIANG", sls: "JORONG KOTO ALAM PADANG BULI-BULI" },
//   // { idsubsls: "1312080002000502", ppl: "rafif shidqi al ghani", desa: "AUA KUNIANG", sls: "JORONG KOTO ALAM PADANG BULI-BULI" },
//   // { idsubsls: "1312080002000503", ppl: "rafif shidqi al ghani", desa: "AUA KUNIANG", sls: "JORONG KOTO ALAM PADANG BULI-BULI" },
//   // { idsubsls: "1312080002000504", ppl: "rafif shidqi al ghani", desa: "AUA KUNIANG", sls: "JORONG KOTO ALAM PADANG BULI-BULI" },
// ];

// async function main() {
//   const dates = [
//     new Date("2026-06-20T00:00:00.000Z"),
//   ];

//   console.log("Starting seed for dates 16 to 20 June 2026...");

//   for (const date of dates) {
//     for (const target of TARGET_DATA) {
//       // Pastikan targetnya ada di database dulu
//       await prisma.monitoringTarget.upsert({
//         where: { idsubsls: target.idsubsls },
//         update: {
//           ppl: target.ppl,
//           desa: target.desa,
//           sls: target.sls,
//         },
//         create: {
//           idsubsls: target.idsubsls,
//           ppl: target.ppl,
//           desa: target.desa,
//           sls: target.sls,
//         },
//       });

//       // Lalu insert/update data hariannya (masing-masing 69)
//       await prisma.monitoringDaily.upsert({
//         where: {
//           idsubsls_date: {
//             idsubsls: target.idsubsls,
//             date: date,
//           },
//         },
//         update: {
//           sudahDidata: 20,
//           belumSubmit: 4,
//           sudahSubmit: 16,
//         },
//         create: {
//           idsubsls: target.idsubsls,
//           date: date,
//           sudahDidata: 20,
//           belumSubmit: 4,
//           sudahSubmit: 16,
//         },
//       });
//     }
//     console.log(`Seeded date: ${date.toISOString()}`);
//   }

//   console.log("Seeding completed successfully.");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
