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

    // 1. Today's Sales (Matches Sale model)
    const salesData = await prisma.sale.aggregate({
      where: {
        branchId: branchId,
        createdAt: { gte: start, lte: end },
        status: "COMPLETED",
      },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    // 2. Active Cashiers (Matches UserBranch model)
    // We count UserBranch entries where the role is CASHIER for this branch
    const activeCashiers = await prisma.userBranch.count({
      where: {
        branchId: branchId,
        role: "CASHIER",
        user: {
          status: "ACTIVE", // Only count them if the main user account is ACTIVE
        },
      },
    });

    // 3. Low Stock Items (Matches ProductInventory model)
    // Your schema uses 'stock' and 'minStock' fields
    const lowStockCount = await prisma.productInventory.count({
      where: {
        branchId: branchId,
        stock: {
          lte: prisma.productInventory.fields.minStock, // Dynamic check against your set minStock
        },
      },
    });

    // 4. Average Ticket
    const totalSales = salesData._sum.totalAmount || 0;
    const salesCount = salesData._count.id || 0;
    const avgTicket = salesCount > 0 ? totalSales / salesCount : 0;

    // 5. Category Share (Stock Distribution)
    const categoryData = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            products: {
              where: {
                inventory: {
                  some: { branchId: branchId },
                },
              },
            },
          },
        },
      },
    });

    // Format it for the frontend
    const categoryShare = categoryData
      .map((cat) => ({
        name: cat.name.toUpperCase(),
        value: cat._count.products,
      }))
      .filter((cat) => cat.value > 0); // Only show categories that have items

    // Add 'categoryShare' to your res.status(200).json({ ... })

    res.status(200).json({
      todaySales: totalSales,
      activeCashiers: activeCashiers,
      lowStockCount: lowStockCount,
      avgTicket: Math.round(avgTicket),
      salesGrowth: "+0%",
      categoryShare: categoryShare,
    });
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
