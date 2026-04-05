import { format } from "date-fns";
import { prisma } from "../lib/prisma.js"; // Adjust path to match your project

// Get Sales Stats
export const getSalesStats = async (req, res) => {
  const { businessId, branchId } = req.query;

  try {
    const whereClause = {
      ...(branchId && branchId !== "ALL"
        ? { branchId }
        : { branch: { businessId } }),
      status: "COMPLETED", // We only count successful sales in stats
    };

    // 1. Total Volume (Sum of all completed sales)
    const totalVolume = await prisma.sale.aggregate({
      where: whereClause,
      _sum: { totalAmount: true },
    });

    // 2. Group by Payment Method to get Cash/MPESA vs Card
    const paymentGroups = await prisma.sale.groupBy({
      by: ["paymentMethod"],
      where: whereClause,
      _sum: { totalAmount: true },
    });

    // Format the response
    const stats = {
      total: totalVolume._sum.totalAmount || 0,
      mobileAndCash: 0,
      cards: 0,
    };

    paymentGroups.forEach((group) => {
      if (group.paymentMethod === "CASH" || group.paymentMethod === "MPESA") {
        stats.mobileAndCash += group._sum.totalAmount;
      } else if (group.paymentMethod === "CARD") {
        stats.cards += group._sum.totalAmount;
      }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales stats" });
  }
};

export const getBranchSalesList = async (req, res) => {
  const { branchId } = req.query;

  try {
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required" });
    }

    const sales = await prisma.sale.findMany({
      where: { branchId },
      include: {
        user: {
          select: { fullName: true }, // In your schema it's 'fullName', not 'name'
        },
        items: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const formattedSales = sales.map((sale) => ({
      // Use your invoiceNo or a sliced ID for the Receipt ID
      id: sale.invoiceNo || sale.id.slice(0, 8).toUpperCase(),
      time: format(new Date(sale.createdAt), "hh:mm a"),
      // Since there's no Customer model relation yet, we show the Cashier or 'Walking Customer'
      customer: "Walking Customer",
      cashier: sale.user?.fullName || "Staff",
      method: sale.paymentMethod, // This will return CASH, MPESA, etc.
      total: `KES ${sale.totalAmount.toLocaleString()}`,
      status: sale.status, // COMPLETED, PENDING, etc.
    }));

    res.json(formattedSales);
  } catch (error) {
    console.error("Sales List Error:", error);
    res.status(500).json({ error: "Failed to fetch sales history" });
  }
};
