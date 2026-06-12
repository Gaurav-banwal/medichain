import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No active session" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Search by primary key (id) first
    let prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { PrescriptionItem: true },
    });

    // If not found, try to search by prescriptionId (blockchain identifier)
    if (!prescription) {
      prescription = await prisma.prescription.findUnique({
        where: { prescriptionId: id },
        include: { PrescriptionItem: true },
      });
    }

    if (!prescription) {
      return NextResponse.json(
        { success: false, error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Role-based Access Control checks:
    // Citizen can only view their own prescriptions
    if (user.role === "CITIZEN" && prescription.patientId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You cannot view this prescription" },
        { status: 403 }
      );
    }

    // Doctor can only view their own given prescriptions
    if (user.role === "DOCTOR" && prescription.doctorId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You cannot view this prescription" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: prescription });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch prescription",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No active session" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { status, txHash, pharmacyId, dispensedAt } = body;

    // Find if the prescription exists first
    let rx = await prisma.prescription.findUnique({
      where: { id },
    });

    if (!rx) {
      rx = await prisma.prescription.findUnique({
        where: { prescriptionId: id },
      });
    }

    if (!rx) {
      return NextResponse.json(
        { success: false, error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Validate prescription state transitions
    if (status === "DISPENSED" || pharmacyId || dispensedAt) {
      if (user.role !== "PHARMACY") {
        return NextResponse.json(
          { success: false, error: "Forbidden: Only users with the PHARMACY role can dispense prescriptions" },
          { status: 403 }
        );
      }

      if (rx.status === "DISPENSED") {
        return NextResponse.json(
          { success: false, error: "Conflict: Prescription has already been dispensed" },
          { status: 409 }
        );
      }

      if (new Date(rx.expiryDate) < new Date()) {
        return NextResponse.json(
          { success: false, error: "Forbidden: Cannot dispense an expired prescription" },
          { status: 403 }
        );
      }
    }

    // Role-based Access Control checks for editing:
    // Doctors can only edit their own prescriptions
    if (user.role === "DOCTOR") {
      if (rx.doctorId !== user.id) {
        return NextResponse.json(
          { success: false, error: "Forbidden: You cannot modify this prescription" },
          { status: 403 }
        );
      }
      // Doctors cannot dispense or set pharmacy details
      if (status === "DISPENSED" || pharmacyId || dispensedAt) {
        return NextResponse.json(
          { success: false, error: "Forbidden: Doctors cannot dispense prescriptions" },
          { status: 403 }
        );
      }
    }

    // Citizens cannot edit prescriptions
    if (user.role === "CITIZEN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Patients cannot modify prescriptions" },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (txHash !== undefined) updateData.txHash = txHash;
    
    if (user.role === "PHARMACY") {
      // Force pharmacyId to be the logged-in user's ID
      updateData.pharmacyId = user.id;
      // Force dispensedAt to be the current date if not specified, or parse specified date
      updateData.dispensedAt = dispensedAt ? new Date(dispensedAt) : new Date();
    } else {
      if (pharmacyId !== undefined) {
        if (pharmacyId) {
          // Check if pharmacyId user exists and is PHARMACY
          const pharmacy = await prisma.user.findUnique({ where: { id: pharmacyId } });
          if (!pharmacy || pharmacy.role !== "PHARMACY") {
            return NextResponse.json(
              { success: false, error: "Invalid pharmacyId or user is not a PHARMACY" },
              { status: 400 }
            );
          }
        }
        updateData.pharmacyId = pharmacyId;
      }
      if (dispensedAt !== undefined) {
        updateData.dispensedAt = dispensedAt ? new Date(dispensedAt) : null;
      }
    }

    const updatedRx = await prisma.prescription.update({
      where: { id: rx.id },
      data: updateData,
      include: { PrescriptionItem: true },
    });

    return NextResponse.json({ success: true, data: updatedRx });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update prescription",
      },
      { status: 500 }
    );
  }
}
