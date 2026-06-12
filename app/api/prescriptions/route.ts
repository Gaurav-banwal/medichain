import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
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
        items.map((item: any) => {
          if (!item.medicineName || !item.dosage || !item.duration || typeof item.quantity !== "number") {
            throw new Error("Invalid item format. Each item must have medicineName, dosage, duration, and quantity (number)");
          }
          return tx.prescriptionItem.create({
            data: {
              id: crypto.randomUUID(),
              prescriptionId: rx.id,
              medicineName: item.medicineName,
              dosage: item.dosage,
              duration: item.duration,
              quantity: item.quantity,
              instructions: item.instructions || null,
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
        PrescriptionItem: true,
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
