import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [userCount, prescriptionCount, auditLogCount] = await Promise.all([
      prisma.user.count(),
      prisma.prescription.count(),
      prisma.auditLog.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        status: "connected",
        database: "medichain",
        counts: {
          users: userCount,
          prescriptions: prescriptionCount,
          auditLogs: auditLogCount,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 500 }
    );
  }
}
