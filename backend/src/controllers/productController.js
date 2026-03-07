// backend/src/controllers/productController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  try {
    const { name, category, subCategory, sku, barcode, brand, uom, costPrice, sellingPrice, inventory } = req.body;

    const product = await prisma.product.create({
      data: {
        name, category, subCategory, sku, barcode, brand, uom,
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
        // This assumes your Prisma schema has an Inventory relation
        inventory: {
          create: inventory.map(item => ({
            branch: item.branch,
            stock: parseInt(item.stock),
            min: parseInt(item.min)
          }))
        }
      },
      include: { inventory: true }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { inventory: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};