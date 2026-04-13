import { prisma } from "../lib/prisma.js";
import {
  subDays,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";

export const getReportStats = async (req, res) => {
  try {
    const { businessId, branchId, range } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: "Business ID required" });
    }

    // 1. Setup Time Ranges
    let currentStart, previousStart, previousEnd, iterations;
    const now = new Date();

    if (range === "month") {
      currentStart = startOfMonth(now);
      previousStart = startOfMonth(subMonths(now, 1));
      previousEnd = endOfMonth(subMonths(now, 1));
      iterations = 30;
    } else if (range === "day") {
      currentStart = startOfDay(now);
      previousStart = startOfDay(subDays(now, 1));
      previousEnd = endOfDay(subDays(now, 1));
      iterations = 1;
    } else {
      currentStart = startOfDay(subDays(now, 6));
      previousStart = startOfDay(subDays(now, 13));
      previousEnd = endOfDay(subDays(now, 7));
      iterations = 7;
    }

    const isAll =
      !branchId || ["ALL", "undefined", "null", ""].includes(branchId);
    const cleanBusinessId = String(businessId).trim();
    const cleanBranchId = !isAll ? String(branchId).trim() : null;

    const filter = {
      businessId: cleanBusinessId,
      ...(isAll ? {} : { branchId: cleanBranchId }),
      status: "COMPLETED",
    };

    // 2. Parallel Data Fetching
    const [currentSales, previousSales, categorySales, bestBranchData] =
      await Promise.all([
        prisma.sale.findMany({
          where: { ...filter, createdAt: { gte: previousStart } },
          select: { totalAmount: true, createdAt: true, branchId: true },
        }),
        prisma.sale.aggregate({
          where: {
            ...filter,
            createdAt: { gte: previousStart, lte: previousEnd },
          },
          _sum: { totalAmount: true },
        }),
        prisma.saleItem.findMany({
          where: {
            sale: {
              ...filter,
              createdAt: { gte: currentStart },
            },
          },
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        }),
        isAll
          ? prisma.sale.groupBy({
              by: ["branchId"],
              where: {
                businessId: cleanBusinessId,
                createdAt: { gte: currentStart },
                status: "COMPLETED",
              },
              _sum: { totalAmount: true },
              orderBy: { _sum: { totalAmount: "desc" } },
              take: 1,
            })
          : null,
      ]);

    // 3. Process Totals & Growth
    const currentTotal = currentSales
      .filter((s) => s.createdAt >= currentStart)
      .reduce((sum, s) => sum + (s.totalAmount || 0), 0);

    const prevTotal = previousSales._sum.totalAmount || 0;

    const growth =
      prevTotal === 0
        ? currentTotal > 0
          ? 100
          : 0
        : Math.round(((currentTotal - prevTotal) / prevTotal) * 100);

    // 4. Process Category Data
    const catMap = {};
    categorySales.forEach((item) => {
      const name = item.product?.category?.name || "Uncategorized";
      // Ensure we use totalPrice or calculate it (quantity * unitPrice)
      catMap[name] = (catMap[name] || 0) + (item.totalPrice || 0);
    });

    const categoryData = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 5. Process Trend Data for Charts
    const trendData = Array.from({ length: iterations }).map((_, i) => {
      const date = subDays(now, iterations - 1 - i);
      const dayLabel = format(date, range === "month" ? "dd MMM" : "EEE");
      const dateString = format(date, "yyyy-MM-dd");

      const daySales = currentSales
        .filter((s) => format(s.createdAt, "yyyy-MM-dd") === dateString)
        .reduce((sum, s) => sum + (s.totalAmount || 0), 0);

      // Comparison logic for "Previous Period" line in chart
      const compDate = subDays(date, iterations);
      const compDateString = format(compDate, "yyyy-MM-dd");
      const compSales = currentSales
        .filter((s) => format(s.createdAt, "yyyy-MM-dd") === compDateString)
        .reduce((sum, s) => sum + (s.totalAmount || 0), 0);

      return { day: dayLabel, sales: daySales, lastWeek: compSales };
    });

    // 6. Branch Name Resolution
    let topBranchName = "N/A";
    if (isAll && bestBranchData?.length > 0) {
      const b = await prisma.branch.findUnique({
        where: { id: bestBranchData[0].branchId },
        select: { name: true },
      });
      topBranchName = b?.name || "N/A";
    } else if (!isAll && cleanBranchId) {
      const b = await prisma.branch.findUnique({
        where: { id: cleanBranchId },
        select: { name: true },
      });
      topBranchName = b?.name || "N/A";
    }

    // Success response - No more terminal noise
    res.status(200).json({
      totalRevenue: currentTotal,
      percentageGrowth: growth,
      bestCategory: categoryData[0]?.name || "No Sales",
      bestBranch: topBranchName,
      trendData,
      categoryData,
    });
  } catch (error) {
    console.error("REPORT HUB ERROR:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getManagerSummary = async (req, res) => {
  try {
    const { branchId } = req.query;
    const today = new Date();

    // 1. Fetch Basic Stats (Already working)
    const [todaySales, yesterdaySales, lowStockItems, activeStaff, branchInfo] =
      await Promise.all([
        prisma.sale.aggregate({
          where: {
            branchId,
            createdAt: { gte: startOfDay(today), lte: endOfDay(today) },
            status: "COMPLETED",
          },
          _sum: { totalAmount: true },
          _count: { id: true },
        }),
        prisma.sale.aggregate({
          where: {
            branchId,
            createdAt: {
              gte: startOfDay(subDays(today, 1)),
              lte: endOfDay(subDays(today, 1)),
            },
            status: "COMPLETED",
          },
          _sum: { totalAmount: true },
        }),
        prisma.productInventory.count({
          where: { branchId, stock: { lte: 10 } },
        }),
        prisma.userBranch.count({
          where: { branchId, user: { status: "ACTIVE" } },
        }),
        prisma.branch.findUnique({
          where: { id: branchId },
          select: { name: true, businessId: true },
        }),
      ]);

    // 2. REVENUE VELOCITY (Last 7 Days)
    const sevenDaysAgo = startOfDay(subDays(today, 6));
    const dailySales = await prisma.sale.groupBy({
      by: ["createdAt"],
      where: {
        branchId,
        createdAt: { gte: sevenDaysAgo },
        status: "COMPLETED",
      },
      _sum: { totalAmount: true },
    });

    // Format for Recharts
    const revenueVelocity = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(today, 6 - i);
      const dayLabel = format(date, "EEE");
      const dayData = dailySales.find(
        (s) => format(s.createdAt, "EEE") === dayLabel,
      );
      return {
        day: dayLabel,
        amount: dayData?._sum.totalAmount || 0,
        prevAmount: 0, // You can add logic for previous week here if needed
      };
    });

    // 3. CATEGORY SHARE (Top Categories by Inventory Count)
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            products: { where: { businessId: branchInfo?.businessId } },
          },
        },
      },
      take: 4,
    });

    const categoryShare = categories.map((cat) => ({
      name: cat.name,
      value: cat._count.products,
    }));

    // 4. Calculate Growth
    const currentRev = todaySales._sum.totalAmount || 0;
    const prevRev = yesterdaySales._sum.totalAmount || 0;
    const growth =
      prevRev > 0
        ? `${(((currentRev - prevRev) / prevRev) * 100).toFixed(1)}%`
        : "+0%";

    res.status(200).json({
      branchName: branchInfo?.name,
      todaySales: currentRev,
      salesGrowth: growth,
      avgTicket:
        todaySales._count.id > 0 ? currentRev / todaySales._count.id : 0,
      activeCashiers: activeStaff,
      lowStockCount: lowStockItems,
      revenueVelocity, // Now has real data
      categoryShare, // Now has real data
    });
  } catch (error) {
    console.error("Manager Summary Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
