import { prisma } from "../lib/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { branchId } = req.query; // If provided, we filter by branch
    const { businessId } = req.user; // From Auth Middleware

    // Define the base filter
    const whereClause = { businessId };
    if (branchId && branchId !== "ALL") {
      whereClause.id = branchId; // If specific branch selected
    }

    // 1. Get Branch Data (for KPI counts)
    const branches = await prisma.branch.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { users: true } // Counts staff linked to branches
        }
      }
    });

    // 2. Aggregate KPIs
    const totalBranches = branches.length;
    const totalStaff = branches.reduce((acc, b) => acc + b._count.users, 0);
    const totalBudget = branches.reduce((acc, b) => acc + (b.budget || 0), 0);
    const totalRevenueTarget = branches.reduce((acc, b) => acc + (b.revenueTarget || 0), 0);

    // 3. Placeholder for Real Sales/Products 
    // (Since you haven't built those tables yet, we return 0 or branch defaults)
    res.json({
      kpis: [
        { title: "Revenue Target", value: `KES ${totalRevenueTarget.toLocaleString()}`, trend: "Target", type: "neutral" },
        { title: "Allocated Budget", value: `KES ${totalBudget.toLocaleString()}`, trend: "Monthly", type: "profit" },
        { title: "Team Members", value: totalStaff.toString(), trend: "Active", type: "neutral" },
        { title: "Total Branches", value: totalBranches.toString(), trend: "Operational", type: "profit" },
      ],
      // For now, we return empty arrays for charts until those tables exist
      recentOrders: [],
      chartData: [] 
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to fetch real dashboard data." });
  }
};