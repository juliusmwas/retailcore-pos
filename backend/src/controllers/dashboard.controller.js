import { prisma } from "../lib/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { branchId } = req.query;
    const { businessId } = req.user;

    // Filter logic: Always filter by businessId. 
    // If a specific branch is selected, filter by that too.
    const filter = { businessId };
    if (branchId && branchId !== "ALL") {
      filter.branchId = branchId; 
    }

    // 1. PULL REAL DATA IN PARALLEL
    const [salesAggregate, transactionCount, lowStockCount] = await Promise.all([
      // Sum all 'totalAmount' from the Sale table
      prisma.sale.aggregate({
        where: filter,
        _sum: { totalAmount: true }
      }),
      // Count total number of sales records
      prisma.sale.count({
        where: filter
      }),
      // Count inventory items where current stock <= minimum stock
      prisma.inventory.count({
        where: {
          ...filter,
          stock: { lte: prisma.inventory.fields.minStock } // Dynamic schema field comparison
        }
      })
    ]);

    const totalSales = salesAggregate._sum.totalAmount || 0;
    // For now, let's say Net Profit is 70% of sales until you add 'Cost Price' to your schema
    const netProfit = totalSales * 0.7; 

    res.json({
      status: "success",
      data: {
        kpis: [
          { 
            title: "Total Sales", 
            value: `KES ${totalSales.toLocaleString()}`, 
            trend: "+10%", // This would be calculated by comparing to last week
            icon: "FiDollarSign", 
            color: "text-green-600", 
            bg: "bg-green-100" 
          },
          { 
            title: "Net Profit", 
            value: `KES ${netProfit.toLocaleString()}`, 
            trend: "70% Margin", 
            icon: "FiTrendingUp", 
            color: "text-blue-600", 
            bg: "bg-blue-100" 
          },
          { 
            title: "Transactions", 
            value: transactionCount.toString(), 
            trend: "Live", 
            icon: "FiActivity", 
            color: "text-purple-600", 
            bg: "bg-purple-100" 
          },
          { 
            title: "Low Stock Items", 
            value: lowStockCount.toString(), 
            trend: lowStockCount > 0 ? "Critical" : "Healthy", 
            icon: "FiBox", 
            color: "text-red-600", 
            bg: "bg-red-100" 
          },
        ],
        recentOrders: [], // Next step
        chartData: [] // Next step
      }
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Error updating dashboard metrics." });
  }
};