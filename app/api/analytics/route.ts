import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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
    const yearParam = searchParams.get("year");
    const currentYear = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    // -------------------------------------------------------------
    // 1. REGULATOR (GOVERNMENT) ANALYTICS
    // -------------------------------------------------------------
    if (user.role === "REGULATOR") {
      // Aggregate national sales (all pharmacies)
      const nationalSalesSum = await prisma.dispensedMedicine.aggregate({
        _sum: {
          quantityDispensed: true,
          totalPrice: true,
        },
      });

      // Aggregate national inventory (all stocks)
      const nationalInventorySum = await prisma.pharmacyInventory.aggregate({
        _sum: {
          quantity: true,
          soldQuantity: true,
          totalSales: true,
        },
      });

      // Group sales by medicine
      const salesByMedicineRaw = await prisma.dispensedMedicine.groupBy({
        by: ["medicineId"],
        _sum: {
          quantityDispensed: true,
          totalPrice: true,
        },
      });

      // Fetch medicine details for naming
      const medicines = await prisma.medicine.findMany({
        where: {
          id: { in: salesByMedicineRaw.map((s) => s.medicineId) },
        },
        select: {
          id: true,
          name: true,
          unit: true,
        },
      });

      const salesByMedicine = salesByMedicineRaw.map((item) => {
        const med = medicines.find((m) => m.id === item.medicineId);
        return {
          medicineId: item.medicineId,
          medicineName: med?.name || "Unknown Medicine",
          unit: med?.unit || "mg",
          totalQuantity: item._sum.quantityDispensed || 0,
          totalRevenue: item._sum.totalPrice || 0,
        };
      });

      // Get monthly sales data for current year
      const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`);
      const nationalYearSales = await prisma.dispensedMedicine.findMany({
        where: {
          dispensedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          quantityDispensed: true,
          totalPrice: true,
          dispensedAt: true,
        },
      });

      const monthlySales = Array.from({ length: 12 }, (_, index) => ({
        month: new Date(0, index).toLocaleString("default", { month: "short" }),
        quantity: 0,
        revenue: 0,
      }));

      nationalYearSales.forEach((sale) => {
        const monthIndex = new Date(sale.dispensedAt).getMonth();
        monthlySales[monthIndex].quantity += sale.quantityDispensed;
        monthlySales[monthIndex].revenue += sale.totalPrice;
      });

      // Banned/regulated sales alerts
      const bannedSalesAlerts = await prisma.dispensedMedicine.findMany({
        where: {
          Medicine: {
            MedicineRegulation: {
              isBanned: true,
            },
          },
        },
        include: {
          Medicine: {
            select: { name: true },
          },
          User: {
            select: { name: true, email: true },
          },
        },
        orderBy: {
          dispensedAt: "desc",
        },
        take: 10,
      });

      return NextResponse.json({
        success: true,
        role: "REGULATOR",
        data: {
          summary: {
            totalNationalRevenue: nationalSalesSum._sum.totalPrice || 0,
            totalNationalItemsSold: nationalSalesSum._sum.quantityDispensed || 0,
            totalNationalStockRemaining: nationalInventorySum._sum.quantity || 0,
          },
          salesByMedicine,
          monthlySales,
          bannedSalesAlerts: bannedSalesAlerts.map((alert) => ({
            id: alert.id,
            medicineName: alert.Medicine.name,
            quantityDispensed: alert.quantityDispensed,
            pharmacyName: alert.User.name,
            pharmacyEmail: alert.User.email,
            dispensedAt: alert.dispensedAt,
          })),
        },
      });
    }

    // -------------------------------------------------------------
    // 2. PHARMACY ANALYTICS
    // -------------------------------------------------------------
    if (user.role === "PHARMACY") {
      // Aggregate this pharmacy's sales
      const pharmacySalesSum = await prisma.dispensedMedicine.aggregate({
        where: { pharmacyId: user.id },
        _sum: {
          quantityDispensed: true,
          totalPrice: true,
        },
      });

      // Aggregate this pharmacy's inventory
      const pharmacyInventorySum = await prisma.pharmacyInventory.aggregate({
        where: { pharmacyId: user.id },
        _sum: {
          quantity: true,
          soldQuantity: true,
          totalSales: true,
        },
      });

      // Get stock and inventory details
      const inventoryItems = await prisma.pharmacyInventory.findMany({
        where: { pharmacyId: user.id },
        include: {
          Medicine: {
            select: {
              name: true,
              unit: true,
            },
          },
        },
      });

      const inventory = inventoryItems.map((item) => ({
        medicineId: item.medicineId,
        medicineName: item.Medicine.name,
        unit: item.Medicine.unit,
        stockRemaining: item.quantity,
        price: item.price,
        soldQuantity: item.soldQuantity,
        totalSales: item.totalSales,
      }));

      // Get monthly sales data for current year for this pharmacy
      const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`);
      const pharmacyYearSales = await prisma.dispensedMedicine.findMany({
        where: {
          pharmacyId: user.id,
          dispensedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          quantityDispensed: true,
          totalPrice: true,
          dispensedAt: true,
        },
      });

      const monthlySales = Array.from({ length: 12 }, (_, index) => ({
        month: new Date(0, index).toLocaleString("default", { month: "short" }),
        quantity: 0,
        revenue: 0,
      }));

      pharmacyYearSales.forEach((sale) => {
        const monthIndex = new Date(sale.dispensedAt).getMonth();
        monthlySales[monthIndex].quantity += sale.quantityDispensed;
        monthlySales[monthIndex].revenue += sale.totalPrice;
      });

      // Low stock alerts (items with less than 15 units remaining)
      const lowStockAlerts = inventory.filter((item) => item.stockRemaining < 15);

      return NextResponse.json({
        success: true,
        role: "PHARMACY",
        data: {
          summary: {
            totalRevenue: pharmacySalesSum._sum.totalPrice || 0,
            totalItemsSold: pharmacySalesSum._sum.quantityDispensed || 0,
            totalStockRemaining: pharmacyInventorySum._sum.quantity || 0,
          },
          inventory,
          monthlySales,
          lowStockAlerts,
        },
      });
    }

    // -------------------------------------------------------------
    // 3. UNAUTHORIZED ROLES
    // -------------------------------------------------------------
    return NextResponse.json(
      { success: false, error: "Forbidden: Analytics only available for PHARMACY and REGULATOR roles" },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load analytics data",
      },
      { status: 500 }
    );
  }
}
