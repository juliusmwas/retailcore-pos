import { prisma } from "../lib/prisma.js";
import { startOfDay, endOfDay } from "date-fns"; 

export const getManagerSummary = async (req, res) => {
  try {
    const { branchId } = req.query;

    if (!branchId) {
      return res.status(400).json({ message: "Branch ID is required" });
    }

    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    // 1. Today's Sales Calculation
    const salesData = await prisma.sale.aggregate({
      where: {
        branchId: branchId,
        createdAt: { gte: start, lte: end },
        status: "COMPLETED",
      },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    // 2. Active Cashiers (Users assigned to this branch who are ACTIVE)
    const activeCashiers = await prisma.user.count({
      where: {
        branches: { some: { branchId: branchId } },
        status: "ACTIVE",
        role: "CASHIER",
      },
    });

    // 3. Low Stock Items (Products in this branch below minStockLevel)
    const lowStockCount = await prisma.product.count({
      where: {
        branchId: branchId,
        quantity: { lt: prisma.product.fields.minStockLevel },
      },
    });

    // 4. Average Ticket (Total Sales / Number of Sales)
    const totalSales = salesData._sum.totalAmount || 0;
    const salesCount = salesData._count.id || 0;
    const avgTicket = salesCount > 0 ? totalSales / salesCount : 0;

    res.status(200).json({
      todaySales: totalSales,
      activeCashiers: activeCashiers,
      lowStockCount: lowStockCount,
      avgTicket: Math.round(avgTicket),
      salesGrowth: "+12%", // Mocking growth for now
    });
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};