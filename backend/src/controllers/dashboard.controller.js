import { prisma } from "../lib/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { branchId } = req.query;
    const { businessId } = req.user;

    // Filter for branch-specific queries
    const branchFilter = (branchId && branchId !== "ALL") ? { id: branchId } : {};
    const inventoryFilter = (branchId && branchId !== "ALL") ? { branchId } : {};

    // 1. PULL REAL DATA FROM YOUR SCHEMA
    const [branchCount, staffCount, productCount, lowStockItems] = await Promise.all([
      // Count Branches for this business
      prisma.branch.count({ where: { businessId } }),
      
      // Count Staff (UserBranch entries)
      prisma.userBranch.count({ 
        where: { 
          branch: { businessId } // Filter staff by business
        } 
      }),

      // Count unique Products in the catalog
      prisma.product.count({ where: { businessId } }),

      // Count Low Stock from ProductInventory
      prisma.productInventory.count({
        where: {
          ...inventoryFilter,
          stock: { lte: 5 } // Hardcoded 5 for now, or use prisma.productInventory.fields.minStock
        }
      })
    ]);

    res.json({
        kpis: [
          { 
            title: "Total Branches", 
            value: branchCount.toString(), 
            trend: "Active", 
            icon: "FiMapPin", 
            color: "text-blue-600", 
            bg: "bg-blue-100" 
          },
          { 
            title: "Active Staff", 
            value: staffCount.toString(), 
            trend: "Across Business", 
            icon: "FiUsers", 
            color: "text-green-600", 
            bg: "bg-green-100" 
          },
          { 
            title: "Product Catalog", 
            value: productCount.toString(), 
            trend: "Items", 
            icon: "FiBox", 
            color: "text-purple-600", 
            bg: "bg-purple-100" 
          },
          { 
            title: "Low Stock Alert", 
            value: lowStockItems.toString(), 
            trend: "Attention", 
            icon: "FiAlertCircle", 
            color: "text-red-600", 
            bg: "bg-red-100" 
          },
        ],
        recentOrders: [], 
        chartData: [] 
      
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Error updating dashboard metrics." });
  }
};