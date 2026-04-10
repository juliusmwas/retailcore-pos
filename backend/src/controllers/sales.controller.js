import { format } from "date-fns";
import { prisma } from "../lib/prisma.js"; // Adjust path to match your project

export const getSalesStats = async (req, res) => {
  try {
    const { businessId, branchId } = req.query;

    // 1. Validation: Prevent PostgreSQL from crashing on invalid UUIDs
    if (!businessId || businessId === "undefined" || businessId.length < 30) {
      return res.status(200).json({ total: 0, mobileAndCash: 0, cards: 0 });
    }

    const whereClause = {
      businessId: businessId,
      ...(branchId && !["ALL", "undefined", "null"].includes(branchId)
        ? { branchId }
        : {}),
      // Use the actual Statuses defined in your Prisma Enum
      status: "COMPLETED",
    };

    // 2. Get Grouped Data (More efficient than multiple queries)
    const stats = await prisma.sale.groupBy({
      by: ["paymentMethod"],
      where: whereClause,
      _sum: { totalAmount: true },
    });

    // 3. Process the results into the format the frontend expects
    let total = 0;
    let mobileAndCash = 0;
    let cards = 0;

    stats.forEach((group) => {
      const amount = Number(group._sum.totalAmount || 0);
      total += amount;

      if (group.paymentMethod === "CASH" || group.paymentMethod === "MPESA") {
        mobileAndCash += amount;
      }
      if (group.paymentMethod === "CARD") {
        cards += amount;
      }
    });

    res.status(200).json({
      total,
      mobileAndCash,
      cards,
      raw: stats, // Keep for debugging
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getBranchSalesList = async (req, res) => {
  const { businessId, branchId } = req.query;

  try {
    if (!businessId || businessId === "undefined") {
      return res.status(400).json({ error: "Business ID is required" });
    }

    const whereClause = {
      businessId: businessId,
      ...(branchId && !["ALL", "undefined", "null"].includes(branchId)
        ? { branchId }
        : {}),
    };

    const sales = await prisma.sale.findMany({
      where: whereClause,
      include: {
        user: { select: { fullName: true } },
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const formattedSales = sales.map((sale) => ({
      id: sale.invoiceNo || sale.id.slice(0, 8).toUpperCase(),
      time: format(new Date(sale.createdAt), "hh:mm a"),
      branchName: sale.branch?.name || "Main Branch",
      cashier: sale.user?.fullName || "Staff",
      method: sale.paymentMethod,
      total: `KES ${Number(sale.totalAmount).toLocaleString()}`,
      status: sale.status,
    }));

    res.json(formattedSales);
  } catch (error) {
    console.error("Sales List Error:", error);
    res.status(500).json({ error: "Failed to fetch sales history" });
  }
};

export const createSale = async (req, res) => {
  const {
    items,
    totalAmount,
    paymentMethod,
    branchId,
    subTotal,
    taxAmount,
    discount,
  } = req.body;

  // Extract user and business info from the token/session
  const businessId = req.user.businessId;
  const userId = req.user.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Generate a unique Invoice Number
      const invoiceNo = `INV-${Date.now()}`;

      // 2. Create the Sale record
      const sale = await tx.sale.create({
        data: {
          invoiceNo,
          subTotal: parseFloat(subTotal || totalAmount),
          taxAmount: parseFloat(taxAmount || 0),
          discount: parseFloat(discount || 0),
          totalAmount: parseFloat(totalAmount),
          paymentMethod: paymentMethod, // Must match enum: CASH, MPESA, CARD, CREDIT
          status: "COMPLETED",
          businessId,
          branchId,
          userId,
          items: {
            create: items.map((item) => {
              // Ensure we handle the price field correctly from frontend
              const unitPrice = parseFloat(item.price);
              const quantity = parseInt(item.quantity);

              if (isNaN(unitPrice) || isNaN(quantity)) {
                throw new Error(
                  `Invalid numeric data for product: ${item.productId}`,
                );
              }

              return {
                productId: item.productId,
                quantity: quantity,
                unitPrice: unitPrice,
                totalPrice: quantity * unitPrice, // Fixes the NaN error
              };
            }),
          },
        },
        // Include items in the return so the frontend can print the receipt immediately
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // 3. Update Inventory (Deduct stock from the specific branch)
      for (const item of items) {
        await tx.productInventory.update({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: branchId,
            },
          },
          data: {
            stock: { decrement: parseInt(item.quantity) },
          },
        });
      }

      return sale;
    });

    res.status(201).json({ message: "Sale completed!", sale: result });
  } catch (error) {
    console.error("Sale Error:", error);
    res.status(500).json({
      message: "Failed to process sale",
      error: error.message,
    });
  }
};
