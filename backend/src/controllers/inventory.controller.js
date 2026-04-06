import { prisma } from "../lib/prisma.js";

export const getBranchInventory = async (req, res) => {
  const { branchId } = req.query;

  try {
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required" });
    }

    // Fetch inventory for this branch and include product details
    const inventoryItems = await prisma.productInventory.findMany({
      where: { branchId: branchId },
      include: {
        product: {
          include: {
            category: true, // Gets the name of the category (Groceries, etc.)
          },
        },
      },
    });

    // Format the data so the frontend can read it easily
    const formattedData = inventoryItems.map((item) => {
      // Logic for status
      let status = "IN STOCK";
      if (item.stock <= 0) status = "OUT OF STOCK";
      else if (item.stock <= item.minStock) status = "LOW STOCK";

      return {
        id: item.product.sku, // e.g., PRD-001
        name: item.product.name,
        category: item.product.category?.name || "Uncategorized",
        stock: item.stock,
        price: `KES ${item.product.sellingPrice.toLocaleString()}`,
        status: status,
        minStock: item.minStock,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error("Inventory Fetch Error:", error);
    res.status(500).json({ error: "Server error fetching inventory" });
  }
};

export const adjustStock = async (req, res) => {
  const { inventoryId, adjustmentAmount, reason } = req.body;

  try {
    // 1. Find the current record
    const currentInventory = await prisma.productInventory.findUnique({
      where: { id: inventoryId },
    });

    if (!currentInventory) {
      return res.status(404).json({ error: "Inventory record not found" });
    }

    // 2. Calculate new stock level
    const newStock = currentInventory.stock + parseInt(adjustmentAmount);

    if (newStock < 0) {
      return res.status(400).json({ error: "Stock cannot fall below zero" });
    }

    // 3. Update the database
    const updated = await prisma.productInventory.update({
      where: { id: inventoryId },
      data: { stock: newStock },
    });

    res.json({ message: "Stock adjusted successfully", updated });
  } catch (error) {
    console.error("Adjustment Error:", error);
    res.status(500).json({ error: "Failed to adjust stock" });
  }
};
