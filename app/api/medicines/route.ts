import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import crypto from "crypto";

// GET /api/medicines
// Returns all medicines and their regulations
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
    const includeBanned = searchParams.get("includeBanned") !== "false"; // Default to true

    const medicines = await prisma.medicine.findMany({
      where: includeBanned ? {} : {
        isBanned: false,
      },
      include: {
        MedicineRegulation: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: medicines, total: medicines.length });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch medicines",
      },
      { status: 500 }
    );
  }
}

// POST /api/medicines
// ONLY ALLOWED FOR REGULATOR (Government)
// Creates a new Medicine along with its initial MedicineRegulation
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No active session" },
        { status: 401 }
      );
    }

    if (user.role !== "REGULATOR") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only REGULATOR (Government) can create or regulate medicines" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      unit,
      maxDosePerDay,
      maxDurationDays,
      scheduleClass,
      isBanned,
      maxDailyDosage,
      regulationMaxDurationDays,
    } = body;

    if (!name || typeof maxDosePerDay !== "number" || typeof maxDurationDays !== "number") {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, maxDosePerDay, maxDurationDays)" },
        { status: 400 }
      );
    }

    // Check if medicine already exists (case-insensitive)
    const existing = await prisma.medicine.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Medicine "${name}" is already registered. Use PATCH/PUT to update it.` },
        { status: 400 }
      );
    }

    const medicineId = crypto.randomUUID();
    const regulationId = crypto.randomUUID();

    const newMedicine = await prisma.$transaction(async (tx) => {
      // 1. Create the Medicine
      const med = await tx.medicine.create({
        data: {
          id: medicineId,
          name,
          unit: unit || "mg",
          maxDosePerDay,
          maxDurationDays,
          isBanned: isBanned || false,
        },
      });

      // 2. Create the associated MedicineRegulation
      await tx.medicineRegulation.create({
        data: {
          id: regulationId,
          medicineId: med.id,
          scheduleClass: scheduleClass || "UNCLASSIFIED",
          isBanned: isBanned || false,
          maxDailyDosage: typeof maxDailyDosage === "number" ? maxDailyDosage : null,
          maxDurationDays: typeof regulationMaxDurationDays === "number" ? regulationMaxDurationDays : null,
          regulatorId: user.id,
          updatedAt: new Date(),
        },
      });

      return tx.medicine.findUnique({
        where: { id: med.id },
        include: { MedicineRegulation: true },
      });
    });

    return NextResponse.json({ success: true, data: newMedicine }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to register medicine",
      },
      { status: 500 }
    );
  }
}
