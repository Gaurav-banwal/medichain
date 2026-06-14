import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import crypto from "crypto";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PATCH /api/medicines/[id]
// ONLY ALLOWED FOR REGULATOR (Government)
// Updates both Medicine details and MedicineRegulation details
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
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
        { success: false, error: "Forbidden: Only REGULATOR (Government) can regulate or update medicines" },
        { status: 403 }
      );
    }

    const { id } = await params;
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

    // Check if the medicine exists
    const medicine = await prisma.medicine.findUnique({
      where: { id },
      include: { MedicineRegulation: true },
    });

    if (!medicine) {
      return NextResponse.json(
        { success: false, error: "Medicine not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update Medicine fields if provided
      const medicineUpdateData: any = {};
      if (name !== undefined) medicineUpdateData.name = name;
      if (unit !== undefined) medicineUpdateData.unit = unit;
      if (maxDosePerDay !== undefined) medicineUpdateData.maxDosePerDay = maxDosePerDay;
      if (maxDurationDays !== undefined) medicineUpdateData.maxDurationDays = maxDurationDays;
      if (isBanned !== undefined) medicineUpdateData.isBanned = isBanned;

      if (Object.keys(medicineUpdateData).length > 0) {
        await tx.medicine.update({
          where: { id },
          data: medicineUpdateData,
        });
      }

      // 2. Update or Upsert MedicineRegulation fields if provided
      const regulationData: any = {
        regulatorId: user.id,
        updatedAt: new Date(),
      };
      if (scheduleClass !== undefined) regulationData.scheduleClass = scheduleClass;
      if (isBanned !== undefined) regulationData.isBanned = isBanned;
      if (maxDailyDosage !== undefined) regulationData.maxDailyDosage = maxDailyDosage;
      if (regulationMaxDurationDays !== undefined) {
        regulationData.maxDurationDays = regulationMaxDurationDays;
      }

      // If the medicine already has a regulation record, update it, otherwise create one
      if (medicine.MedicineRegulation) {
        await tx.medicineRegulation.update({
          where: { medicineId: id },
          data: regulationData,
        });
      } else {
        await tx.medicineRegulation.create({
          data: {
            id: crypto.randomUUID(),
            medicineId: id,
            scheduleClass: scheduleClass || "UNCLASSIFIED",
            isBanned: isBanned || false,
            maxDailyDosage: maxDailyDosage !== undefined ? maxDailyDosage : null,
            maxDurationDays: regulationMaxDurationDays !== undefined ? regulationMaxDurationDays : null,
            regulatorId: user.id,
            updatedAt: new Date(),
          },
        });
      }

      return tx.medicine.findUnique({
        where: { id },
        include: { MedicineRegulation: true },
      });
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update medicine/regulation",
      },
      { status: 500 }
    );
  }
}
