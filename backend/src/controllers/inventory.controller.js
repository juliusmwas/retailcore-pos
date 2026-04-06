import { prisma } from "../lib/prisma.js";

export const getBranchInventory = async (req, res) => {
  const { branchId } = req.query;

  try {
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required" });
    }

    const inventoryItems = await prisma.productInventory.findMany({
      where: { branchId: branchId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const formattedData = inventoryItems.map((item) => {
      let status = "IN STOCK";
      if (item.stock <= 0) status = "OUT OF STOCK";
      else if (item.stock <= item.minStock) status = "LOW STOCK";

      return {
        // ERROR FIX: We MUST include the database primary key here
        dbId: item.id,
        id: item.product.sku,
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
    if (!inventoryId) {
      return res.status(400).json({ error: "Inventory ID is missing" });
    }

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

    // 4. (Optional but Recommended) You could create an Audit Log here in the future
    // using the 'reason' variable provided by the frontend.

    res.json({ message: "Stock adjusted successfully", updated });
  } catch (error) {
    console.error("Adjustment Error:", error);
    res.status(500).json({ error: "Server error during stock adjustment" });
  }
};

export const createRestockRequest = async (req, res) => {
  const { inventoryId, quantity } = req.body;
  const { branchId } = req.user; // Get from the authenticated token

  try {
    const request = await prisma.restockRequest.create({
      data: {
        inventoryId,
        branchId,
        quantity: parseInt(quantity),
        status: "PENDING",
      },
    });

    res.json({ message: "Request sent to Admin successfully", request });
  } catch (error) {
    console.error("Restock Error:", error);
    res.status(500).json({ error: "Failed to submit restock request" });
  }
};
