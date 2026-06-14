import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No active session" },
        { status: 401 }
      );
    }

    if (user.role !== "DOCTOR") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only DOCTORs can issue prescriptions" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      prescriptionId,
      patientId,
      ipfsHash,
      txHash,
      expiryDate,
      items,
    } = body;

    // Basic Validation
    if (!patientId || !ipfsHash || !expiryDate || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields or items is not an array" },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Prescription must contain at least one medicine item" },
        { status: 400 }
      );
    }

    // Validate Patient
    const patient = await prisma.user.findUnique({ where: { id: patientId } });
    if (!patient || patient.role !== "CITIZEN") {
      return NextResponse.json(
        { success: false, error: "Invalid patientId or user is not a CITIZEN" },
        { status: 400 }
      );
    }

    // Validate that all items exist in the Medicine table
    const validatedItems: any[] = [];
    for (const item of items) {
      if (!item.medicineName || !item.dosage || !item.duration || typeof item.quantity !== "number") {
        return NextResponse.json(
          { success: false, error: "Invalid item format. Each item must have medicineName, dosage, duration, and quantity (number)" },
          { status: 400 }
        );
      }

      // Check if medicine exists in the database
      const medicine = await prisma.medicine.findFirst({
        where: {
          name: {
            equals: item.medicineName,
            mode: "insensitive",
          },
        },
      });

      if (!medicine) {
        return NextResponse.json(
          { success: false, error: `Medicine "${item.medicineName}" is not registered in the system` },
          { status: 400 }
        );
      }

      if (medicine.isBanned) {
        return NextResponse.json(
          { success: false, error: `Medicine "${medicine.name}" is currently banned by the government and cannot be prescribed` },
          { status: 400 }
        );
      }

      // Extract / Parse durationDays fallback
      let finalDurationDays = null;
      if (typeof item.durationDays === "number") {
        finalDurationDays = item.durationDays;
      } else if (item.duration) {
        const match = item.duration.match(/\d+/);
        if (match) {
          finalDurationDays = parseInt(match[0], 10);
        }
      }

      // Extract / Parse frequencyPerDay fallback
      let finalFrequencyPerDay = null;
      if (typeof item.frequencyPerDay === "number") {
        finalFrequencyPerDay = item.frequencyPerDay;
      } else if (item.dosage) {
        if (item.dosage.includes("-")) {
          const parts = item.dosage.split("-").map(Number);
          const sum = parts.reduce((a: number, b: number) => a + (isNaN(b) ? 0 : b), 0);
          finalFrequencyPerDay = sum;
        } else {
          const match = item.dosage.match(/\d+/);
          if (match) {
            finalFrequencyPerDay = parseInt(match[0], 10);
          }
        }
      }

      // Extract / Parse dosageAmount fallback
      let finalDosageAmount = null;
      if (typeof item.dosageAmount === "number") {
        finalDosageAmount = item.dosageAmount;
      } else if (item.dosage) {
        const match = item.dosage.match(/\d+(\.\d+)?/);
        if (match) {
          finalDosageAmount = parseFloat(match[0]);
        }
      }

      validatedItems.push({
        ...item,
        medicineId: medicine.id,
        medicineName: medicine.name, // Use canonical database casing
        dosageAmount: finalDosageAmount,
        durationDays: finalDurationDays,
        frequencyPerDay: finalFrequencyPerDay,
      });
    }

    // Generate unique ID and prescriptionId if not provided
    const internalId = crypto.randomUUID();
    const finalPrescriptionId = prescriptionId || `0x${crypto.randomBytes(32).toString("hex")}`;

    // Create prescription and items in a single transaction
    const newPrescription = await prisma.$transaction(async (tx) => {
      const rx = await tx.prescription.create({
        data: {
          id: internalId,
          prescriptionId: finalPrescriptionId,
          doctorId: user.id, // Set doctorId to current user session id
          patientId,
          ipfsHash,
          txHash: txHash || null,
          expiryDate: new Date(expiryDate),
          status: "CREATED",
        },
      });

      // Create all items
      await Promise.all(
        validatedItems.map((item: any) => {
          return tx.prescriptionItem.create({
            data: {
              id: crypto.randomUUID(),
              prescriptionId: rx.id,
              medicineId: item.medicineId,
              instructions: item.instructions || null,
              dosageAmount: item.dosageAmount ?? 1.0,
              durationDays: item.durationDays ?? 1,
              frequencyPerDay: item.frequencyPerDay ?? 1,
            },
          });
        })
      );

      return tx.prescription.findUnique({
        where: { id: rx.id },
        include: { PrescriptionItem: true },
      });
    });

    return NextResponse.json({ success: true, data: newPrescription }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create prescription",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No active session" },
        { status: 401 }
      );
    }

    const { searchParams } = req.nextUrl;
    const filters: any = {};

    // Apply filters based on user role
    if (user.role === "DOCTOR") {
      // Doctor can only see prescriptions they have given
      filters.doctorId = user.id;
    } else if (user.role === "CITIZEN") {
      // Citizen can only see their possessed prescriptions
      filters.patientId = user.id;
    } else {
      // Pharmacy or Regulator can see all, but can also filter
      const doctorId = searchParams.get("doctorId");
      const patientId = searchParams.get("patientId");
      const pharmacyId = searchParams.get("pharmacyId");

      if (doctorId) filters.doctorId = doctorId;
      if (patientId) filters.patientId = patientId;
      if (pharmacyId) filters.pharmacyId = pharmacyId;
    }

    const status = searchParams.get("status");
    if (status) filters.status = status as any;

    const prescriptions = await prisma.prescription.findMany({
      where: filters,
      include: {
        User_Prescription_doctorIdToUser: {
          select: { name: true, email: true }
        },
        User_Prescription_patientIdToUser: {
          select: { name: true, email: true }
        },
        PrescriptionItem: {
          include: {
            Medicine: true
          }
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: prescriptions, total: prescriptions.length });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch prescriptions",
      },
      { status: 500 }
    );
  }
}
