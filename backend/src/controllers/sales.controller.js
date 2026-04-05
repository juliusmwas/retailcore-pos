import { format } from "date-fns";

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

// Get Detailed Sales List for the Table
export const getBranchSalesList = async (req, res) => {
  const { branchId } = req.query;

  try {
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required" });
    }

    const sales = await prisma.sale.findMany({
      where: { branchId },
      include: {
        customer: { select: { name: true } }, // Get customer name from relation
      },
      orderBy: { createdAt: "desc" }, // Latest sales first
      take: 100, // Get the last 100 sales for now
    });

    // Format for your Manager Dashboard UI
    const formattedSales = sales.map((sale) => ({
      id: sale.id,
      time: format(new Date(sale.createdAt), "hh:mm a"), // e.g. 10:45 AM
      customer: sale.customer?.name || "Walking Customer",
      method: sale.paymentMethod,
      total: `KES ${sale.totalAmount.toLocaleString()}`,
      status: sale.status, // Matches your UI: COMPLETED, VOIDED, etc.
    }));

    res.json(formattedSales);
  } catch (error) {
    console.error("Sales List Error:", error);
    res.status(500).json({ error: "Failed to fetch sales history" });
  }
};
