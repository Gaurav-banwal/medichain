import dotenv from "dotenv";
import path from "path";
dotenv.config();

import { prisma } from "./lib/prisma";
import crypto from "crypto";

async function runTestFlow() {
  console.log("=== STARTING END-TO-END TEST FLOW ===\n");

  try {
    // 1. Fetch or create users for the flow
    console.log("Step 1: Setting up mock users...");
    const regulatorUser = await prisma.user.upsert({
      where: { email: "gov.regulator@test.demo" },
      update: {},
      create: {
        name: "Gov Health Inspector",
        email: "gov.regulator@test.demo",
        role: "REGULATOR",
      },
    });

    const doctorUser = await prisma.user.upsert({
      where: { email: "doc.priya@test.demo" },
      update: {},
      create: {
        name: "Dr. Priya Mehta",
        email: "doc.priya@test.demo",
        role: "DOCTOR",
      },
    });

    const pharmacyUser = await prisma.user.upsert({
      where: { email: "apollo.pharma@test.demo" },
      update: {},
      create: {
        name: "Apollo Pharmacy Store",
        email: "apollo.pharma@test.demo",
        role: "PHARMACY",
      },
    });

    const citizenUser = await prisma.user.upsert({
      where: { email: "rahul.sharma@test.demo" },
      update: {},
      create: {
        name: "Rahul Sharma",
        email: "rahul.sharma@test.demo",
        role: "CITIZEN",
      },
    });

    console.log(`- Regulator ID: ${regulatorUser.id}`);
    console.log(`- Doctor ID: ${doctorUser.id}`);
    console.log(`- Pharmacy ID: ${pharmacyUser.id}`);
    console.log(`- Citizen ID: ${citizenUser.id}\n`);

    // 2. Government (REGULATOR) creates a new regulated medicine
    console.log("Step 2: Government registering a new regulated medicine (Morphine)...");
    const medicineName = "Morphine";
    
    // Clean up existing test data to run test fresh
    const existingMed = await prisma.medicine.findUnique({ where: { name: medicineName } });
    if (existingMed) {
      console.log("- Cleaning up existing test records for Morphine...");
      await prisma.pharmacyInventory.deleteMany({ where: { medicineId: existingMed.id } });
      await prisma.dispensedMedicine.deleteMany({ where: { medicineId: existingMed.id } });
      await prisma.prescriptionItem.deleteMany({ where: { medicineId: existingMed.id } });
      await prisma.medicineRegulation.deleteMany({ where: { medicineId: existingMed.id } });
      await prisma.medicine.delete({ where: { id: existingMed.id } });
    }

    const morphine = await prisma.medicine.create({
      data: {
        id: "test-med-morphine",
        name: medicineName,
        unit: "mg",
        maxDosePerDay: 100.0, // Hard limit in medical guide
        maxDurationDays: 10,
        isBanned: false,
      },
    });

    const regulation = await prisma.medicineRegulation.create({
      data: {
        id: "test-reg-morphine",
        medicineId: morphine.id,
        scheduleClass: "Schedule X", // Highly regulated narcotic
        isBanned: false,
        maxDailyDosage: 30.0, // Strict government regulated max dosage limit
        maxDurationDays: 5,   // Strict government duration limit
        regulatorId: regulatorUser.id,
        updatedAt: new Date(),
      },
    });

    console.log(`- Registered Medicine: ${morphine.name}`);
    console.log(`- Schedule Class: ${regulation.scheduleClass}`);
    console.log(`- Government Max Daily Dosage: ${regulation.maxDailyDosage} ${morphine.unit}`);
    console.log(`- Government Max Prescription Duration: ${regulation.maxDurationDays} days\n`);

    // Setup pharmacy starting inventory for this medicine
    await prisma.pharmacyInventory.upsert({
      where: {
        pharmacyId_medicineId: {
          pharmacyId: pharmacyUser.id,
          medicineId: morphine.id,
        },
      },
      update: {
        quantity: 100,
        price: 15.5,
        soldQuantity: 0,
        totalSales: 0.0,
      },
      create: {
        pharmacyId: pharmacyUser.id,
        medicineId: morphine.id,
        quantity: 100,
        price: 15.5,
        soldQuantity: 0,
        totalSales: 0.0,
      },
    });
    console.log("- Pharmacy inventory loaded with 100 units of Morphine @ $15.5 each.\n");

    // 3. Simulating Doctor prescribing excess vs normal
    console.log("Step 3: Checking Doctor Prescriptions against Government Regulations...");

    // Case A: Excess Prescription Check (simulated)
    const proposedExcessDosage = 45.0; // Exceeds government limit of 30.0 mg
    console.log(`- Case A: Doctor attempts to prescribe ${proposedExcessDosage} mg daily.`);
    if (regulation.maxDailyDosage && proposedExcessDosage > regulation.maxDailyDosage) {
      console.log(`  ❌ BLOCKED: Prescription dosage (${proposedExcessDosage} mg) exceeds government regulated limit of ${regulation.maxDailyDosage} mg!`);
    }

    // Case B: Valid Prescription Check
    const validDosage = 20.0; // Within limit
    const validDurationDays = 4;
    console.log(`- Case B: Doctor prescribes ${validDosage} mg daily for ${validDurationDays} days.`);
    
    let prescriptionId = "test-rx-id-1001";
    await prisma.prescription.upsert({
      where: { prescriptionId },
      update: {},
      create: {
        id: "test-rx-uuid-1001",
        prescriptionId,
        doctorId: doctorUser.id,
        patientId: citizenUser.id,
        ipfsHash: "QmMorphinePrescriptionHash1001",
        status: "CREATED",
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.prescriptionItem.create({
      data: {
        id: "test-rx-item-1001",
        prescriptionId: "test-rx-uuid-1001",
        medicineId: morphine.id,
        dosageAmount: validDosage,
        frequencyPerDay: 1,
        durationDays: validDurationDays,
        instructions: "Take once daily before sleep",
      },
    });
    console.log("  ✅ SUCCESS: Prescription successfully created and saved in DB.\n");

    // 4. Simulating Pharmacy dispensing the prescription
    console.log("Step 4: Pharmacy dispensing medicine to Patient...");
    const quantityToDispense = 4; // 1 per day for 4 days
    const pricePerUnit = 15.5;
    const totalPrice = quantityToDispense * pricePerUnit;

    // Transaction to dispense medicine and update inventory
    await prisma.$transaction(async (tx) => {
      // Create Dispensed Record
      await tx.dispensedMedicine.create({
        data: {
          id: "test-dispense-uuid-1001",
          prescriptionId: "test-rx-uuid-1001",
          medicineId: morphine.id,
          quantityDispensed: quantityToDispense,
          pricePerUnit,
          totalPrice,
          pharmacyId: pharmacyUser.id,
          dispensedAt: new Date(),
        },
      });

      // Update Prescription Status
      await tx.prescription.update({
        where: { id: "test-rx-uuid-1001" },
        data: {
          status: "DISPENSED",
          pharmacyId: pharmacyUser.id,
          dispensedAt: new Date(),
        },
      });

      // Update Pharmacy Inventory
      await tx.pharmacyInventory.update({
        where: {
          pharmacyId_medicineId: {
            pharmacyId: pharmacyUser.id,
            medicineId: morphine.id,
          },
        },
        data: {
          quantity: { decrement: quantityToDispense },
          soldQuantity: { increment: quantityToDispense },
          totalSales: { increment: totalPrice },
        },
      });
    });
    console.log(`- Dispensed ${quantityToDispense} units of Morphine.`);
    console.log(`- Total Price Charged: $${totalPrice}\n`);

    // 5. Query and Display Final Database Stats
    console.log("Step 5: Querying database stats...");
    
    // Fetch updated inventory
    const updatedInventory = await prisma.pharmacyInventory.findUnique({
      where: {
        pharmacyId_medicineId: {
          pharmacyId: pharmacyUser.id,
          medicineId: morphine.id,
        },
      },
      include: { Medicine: true },
    });

    // Fetch dispensed logs
    const dispenseLogs = await prisma.dispensedMedicine.findMany({
      where: { pharmacyId: pharmacyUser.id, medicineId: morphine.id },
    });

    console.log("\n--- DATABASE REPORT ---");
    console.log(`Medicine: ${updatedInventory?.Medicine.name} (${updatedInventory?.Medicine.unit})`);
    console.log(`Pharmacy Current Stock: ${updatedInventory?.quantity} units`);
    console.log(`Pharmacy Total Units Sold: ${updatedInventory?.soldQuantity} units`);
    console.log(`Pharmacy Cumulative Revenue: $${updatedInventory?.totalSales}`);
    console.log(`Dispense Log Records Count: ${dispenseLogs.length}`);
    console.log("-----------------------\n");

    console.log("=== TEST FLOW COMPLETED SUCCESSFULLY ===");

  } catch (error) {
    console.error("Test flow failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTestFlow();
