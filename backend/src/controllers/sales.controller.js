// Get Sales Stats
export const getSalesStats = async (req, res) => {
  const { businessId, branchId } = req.query;

  try {
    const whereClause = {
      ...(branchId && branchId !== "ALL" ? { branchId } : { branch: { businessId } }),
      status: "COMPLETED" // We only count successful sales in stats
    };

    // 1. Total Volume (Sum of all completed sales)
    const totalVolume = await prisma.sale.aggregate({
      where: whereClause,
      _sum: { totalAmount: true }
    });

    // 2. Group by Payment Method to get Cash/MPESA vs Card
    const paymentGroups = await prisma.sale.groupBy({
      by: ['paymentMethod'],
      where: whereClause,
      _sum: { totalAmount: true }
    });

    // Format the response
    const stats = {
      total: totalVolume._sum.totalAmount || 0,
      mobileAndCash: 0,
      cards: 0
    };

    paymentGroups.forEach(group => {
      if (group.paymentMethod === 'CASH' || group.paymentMethod === 'MPESA') {
        stats.mobileAndCash += group._sum.totalAmount;
      } else if (group.paymentMethod === 'CARD') {
        stats.cards += group._sum.totalAmount;
      }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales stats" });
  }
};