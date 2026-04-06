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
