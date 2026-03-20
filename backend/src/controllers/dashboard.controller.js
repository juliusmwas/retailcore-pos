import { prisma } from "../lib/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { branchId } = req.query;
    const { businessId } = req.user;

    // --- 1. DEFINE FILTERS ---
    // General filter for tables tied directly to Business (like Sale)
    const filter = { businessId };
    if (branchId && branchId !== "ALL") {
      filter.branchId = branchId;
    }

    // Special filter for Branch table itself (uses 'id' instead of 'branchId')
    const branchTableFilter = (branchId && branchId !== "ALL") ? { id: branchId, businessId } : { businessId };

    // --- 2. PULL KPI DATA ---
    const [branchCount, staffCount, productCount, lowStockItems] = await Promise.all([
      prisma.branch.count({ where: { businessId } }),
      
      prisma.userBranch.count({ 
        where: { 
          branch: { businessId } 
        } 
      }),

      prisma.product.count({ where: { businessId } }),

      prisma.productInventory.count({
        where: {
          ...(branchId && branchId !== "ALL" ? { branchId } : { branch: { businessId } }),
          stock: { lte: 5 } 
        }
      })
    ]);

    // --- 3. REVENUE VELOCITY (CHART) ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailySales = await prisma.sale.groupBy({
      by: ['createdAt'],
      where: {
        ...filter,
        createdAt: { gte: sevenDaysAgo }
      },
      _sum: {
        totalAmount: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const chartData = dailySales.map(day => ({
      name: new Date(day.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
      sales: day._sum.totalAmount || 0
    }));

    // --- 4. RECENT ACTIVITY (TABLE) ---
    const recentOrdersRaw = await prisma.sale.findMany({
      where: filter,
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      }
    });

    const formattedOrders = recentOrdersRaw.map(order => ({
      id: order.id.split('-')[0].toUpperCase(),
      customer: "Walk-in Customer", 
      amount: order.totalAmount,
      status: order.status,
      time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));


    // --- 5. INVENTORY RISK (LOW STOCK) ---
const lowStockRaw = await prisma.productInventory.findMany({
  where: {
    // If a branch is selected, filter by that branch. 
    // Otherwise, check all branches under this business.
    ...(branchId && branchId !== "ALL" ? { branchId } : { branch: { businessId } }),
    stock: { lte: 5 } // You can change this threshold later
  },
  take: 5, // Just show the top 5 most urgent risks
  include: {
    product: {
      select: { name: true }
    }
  },
  orderBy: {
    stock: 'asc' // Show the lowest stock first
  }
});

// Format the data to match your Frontend { name, stock }
const formattedLowStock = lowStockRaw.map(item => ({
  name: item.product.name,
  stock: item.stock
}));

    // --- 5. FINAL RESPONSE ---
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
      chartData: chartData,
      recentOrders: formattedOrders,
      lowStock: formattedLowStock
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Error updating dashboard metrics." });
  }
};