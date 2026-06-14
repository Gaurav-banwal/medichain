import bcryptjs from 'bcryptjs';
import { prisma } from '../lib/prisma';

async function seedUser() {
  console.log("Seeding Hackathon Demo Accounts...");

  const password = "securepassword123";
  const passwordHash = await bcryptjs.hash(password, 10);

  // Clean conflicting prescriptions and items first to ensure smooth run
  await prisma.prescriptionItem.deleteMany({});
  await prisma.prescription.deleteMany({});

  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["doctor@gmail.com", "pharmacy@gmail.com", "gov@gmail.com"]
      }
    }
  });

  // 1. Create/Update Citizen
  const citizen = await prisma.user.upsert({
    where: { email: "gauravbanwal1234@gmail.com" },
    update: { passwordHash },
    create: {
      name: "Gaurav Banwal",
      email: "gauravbanwal1234@gmail.com",
      role: "CITIZEN",
      walletAddress: "0x7a2d9b21f9c388b098defB751B7401B5f6d8976F",
      passwordHash,
    },
  });
  console.log(`✅ Citizen: ${citizen.email}`);

  // 2. Create/Update Doctor
  const doctor = await prisma.user.upsert({
    where: { email: "doctor@gmail.com" },
    update: { passwordHash },
    create: {
      name: "Dr. Sarah Chen",
      email: "doctor@gmail.com",
      role: "DOCTOR",
      walletAddress: "0x2222222222222222222222222222222222222229",
      passwordHash,
    },
  });
  console.log(`✅ Doctor: ${doctor.email}`);

  // 3. Create/Update Pharmacy
  const pharmacy = await prisma.user.upsert({
    where: { email: "pharmacy@gmail.com" },
    update: { passwordHash },
    create: {
      name: "Central Pharma Store",
      email: "pharmacy@gmail.com",
      role: "PHARMACY",
      walletAddress: "0x3333333333333333333333333333333333333339",
      passwordHash,
    },
  });
  console.log(`✅ Pharmacy: ${pharmacy.email}`);

  // 4. Create/Update Regulator
  const regulator = await prisma.user.upsert({
    where: { email: "gov@gmail.com" },
    update: { passwordHash },
    create: {
      name: "Gov. Health Inspector",
      email: "gov@gmail.com",
      role: "REGULATOR",
      passwordHash,
    },
  });
  console.log(`✅ Regulator: ${regulator.email}`);

  // 5. Ensure Medicines exist
  const paracetamol = await prisma.medicine.upsert({
    where: { name: "Paracetamol" },
    update: {},
    create: {
      id: "demo-medicine-id-1",
      name: "Paracetamol",
      unit: "mg",
      maxDosePerDay: 1000,
      maxDurationDays: 10,
    },
  });

  const amoxicillin = await prisma.medicine.upsert({
    where: { name: "Amoxicillin" },
    update: {},
    create: {
      id: "demo-medicine-id-2",
      name: "Amoxicillin",
      unit: "mg",
      maxDosePerDay: 750,
      maxDurationDays: 14,
    },
  });

  // 6. Create sample prescriptions for the citizen issued by this doctor
  console.log("Seeding sample prescriptions...");

  await prisma.prescription.upsert({
    where: { prescriptionId: "0xabc123demo00000000000000000000000000001" },
    update: {
      patientId: citizen.id,
      doctorId: doctor.id
    },
    create: {
      id: "demo-prescription-id-1",
      prescriptionId: "0xabc123demo00000000000000000000000000001",
      doctorId: doctor.id,
      patientId: citizen.id,
      ipfsHash: "QmDemoPrescriptionHash123456789abcdef",
      txHash: "0xdemo_tx_hash_prescription_created",
      status: "CREATED",
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      PrescriptionItem: {
        create: [
          {
            id: "demo-item-id-1",
            medicineId: paracetamol.id,
            dosageAmount: 500.0,
            frequencyPerDay: 2,
            durationDays: 5,
            instructions: "Take after meals, twice daily",
          },
          {
            id: "demo-item-id-2",
            medicineId: amoxicillin.id,
            dosageAmount: 250.0,
            frequencyPerDay: 3,
            durationDays: 7,
            instructions: "Take one capsule every 8 hours",
          },
        ],
      },
    },
  });

  await prisma.prescription.upsert({
    where: { prescriptionId: "0xdef456demo00000000000000000000000000002" },
    update: {
      patientId: citizen.id,
      doctorId: doctor.id
    },
    create: {
      id: "demo-prescription-id-2",
      prescriptionId: "0xdef456demo00000000000000000000000000002",
      doctorId: doctor.id,
      patientId: citizen.id,
      ipfsHash: "QmDemoPrescriptionHash987654321fedcba",
      txHash: "0xdemo_tx_hash_prescription_dispensed",
      status: "DISPENSED",
      expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Expired 5 days ago
      PrescriptionItem: {
        create: [
          {
            id: "demo-item-id-3",
            medicineId: paracetamol.id,
            dosageAmount: 650.0,
            frequencyPerDay: 1,
            durationDays: 3,
            instructions: "Take as needed for pain relief",
          }
        ],
      },
    },
  });

  console.log("🎉 All accounts and demo data seeded successfully!");
}

seedUser()
  .catch(err => {
    console.error("❌ Seed failed:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
