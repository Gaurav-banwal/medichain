import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding MediChain demo data...\n");

  // ─── USERS ────────────────────────────────────────────

  const citizen = await prisma.user.upsert({
    where: { email: "patient@medichain.demo" },
    update: {},
    create: {
      name: "Rahul Sharma",
      email: "patient@medichain.demo",
      role: "CITIZEN",
      walletAddress: "0x1111111111111111111111111111111111111111",
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: "doctor@medichain.demo" },
    update: {},
    create: {
      name: "Dr. Priya Mehta",
      email: "doctor@medichain.demo",
      role: "DOCTOR",
      walletAddress: "0x2222222222222222222222222222222222222222",
    },
  });

  const pharmacy = await prisma.user.upsert({
    where: { email: "pharmacy@medichain.demo" },
    update: {},
    create: {
      name: "Apollo Pharmacy — Koramangala",
      email: "pharmacy@medichain.demo",
      role: "PHARMACY",
      walletAddress: "0x3333333333333333333333333333333333333333",
    },
  });

  const regulator = await prisma.user.upsert({
    where: { email: "regulator@medichain.demo" },
    update: {},
    create: {
      name: "Gov. Health Audit Officer",
      email: "regulator@medichain.demo",
      role: "REGULATOR",
    },
  });

  // ─── PRESCRIPTION ────────────────────────────────────

  const prescription = await prisma.prescription.upsert({
    where: { prescriptionId: "0xabc123demo00000000000000000000000000001" },
    update: {},
    create: {
      id: "demo-prescription-id-1",
      prescriptionId: "0xabc123demo00000000000000000000000000001",
      doctorId: doctor.id,
      patientId: citizen.id,
      ipfsHash: "QmDemoPrescriptionHash123456789abcdef",
      txHash: "0xdemo_tx_hash_prescription_created",
      status: "CREATED",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      PrescriptionItem: {
        create: [
          {
            id: "demo-item-id-1",
            medicineName: "Paracetamol 500mg",
            dosage: "500mg",
            duration: "5 days",
            quantity: 10,
            instructions: "Take after meals, twice daily",
          },
          {
            id: "demo-item-id-2",
            medicineName: "Amoxicillin 250mg",
            dosage: "250mg",
            duration: "7 days",
            quantity: 14,
            instructions: "Take one capsule every 8 hours",
          },
        ],
      },
    },
    include: { PrescriptionItem: true },
  });

  // ─── AUDIT LOG ───────────────────────────────────────

  await prisma.auditLog.create({
    data: {
      id: "demo-audit-log-id-1",
      userId: doctor.id,
      role: "DOCTOR",
      action: "PRESCRIPTION_CREATED",
      entityId: prescription.id,
    },
  });

  // ─── SUMMARY ─────────────────────────────────────────

  console.log("Users:");
  console.log(`  Citizen   → ${citizen.email}`);
  console.log(`  Doctor    → ${doctor.email}`);
  console.log(`  Pharmacy  → ${pharmacy.email}`);
  console.log(`  Regulator → ${regulator.email}`);
  console.log(`\nPrescription: ${prescription.prescriptionId}`);
  console.log(`  Items: ${prescription.PrescriptionItem.length}`);
  console.log(`  txHash: ${prescription.txHash ?? "N/A"}`);
  console.log("\nSeed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
