import { prisma } from "../lib/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { branchId } = req.query;
    const { businessId } = req.user;

    const whereClause = { businessId };
    if (branchId && branchId !== "ALL") {
      whereClause.id = branchId;
    }

    // Fetch branches to get staff counts and basic info
    const branches = await prisma.branch.findMany({
      where: whereClause,
      include: {
        _count: { select: { users: true } }
      }
    });

    // 💡 FUTURE LOGIC: Here is where we will query prisma.sale.aggregate()
    // For now, we provide the real keys with 0 values
    const totalSales = 0; 
    const netProfit = 0;
    const transactionCount = 0;
    const lowStockCount = 5; // Placeholder until Products table is live

    res.json({
      kpis: [
        { 
          title: "Total Sales", 
          value: `KES ${totalSales.toLocaleString()}`, 
          trend: "+0%", 
          icon: "FiDollarSign", // Pass string names for icons
          color: "text-green-600", 
          bg: "bg-green-100" 
        },
        { 
          title: "Net Profit", 
          value: `KES ${netProfit.toLocaleString()}`, 
          trend: "Stable", 
          icon: "FiTrendingUp", 
          color: "text-blue-600", 
          bg: "bg-blue-100" 
        },
        { 
          title: "Transactions", 
          value: transactionCount.toString(), 
          trend: "Today", 
          icon: "FiActivity", 
          color: "text-purple-600", 
          bg: "bg-purple-100" 
        },
        { 
          title: "Low Stock Items", 
          value: lowStockCount.toString(), 
          trend: "Attention", 
          icon: "FiBox", 
          color: "text-red-600", 
          bg: "bg-red-100" 
        },
      ],
      recentOrders: [],
      chartData: [] // We'll fill this once we have a Sales table
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating dashboard metrics." });
  }
};