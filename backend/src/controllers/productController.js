import { prisma } from '../lib/prisma.js';

export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const businessId = req.user?.businessId || data.businessId;

    if (!businessId) {
      return res.status(401).json({ message: "Unauthorized: Business ID missing" });
    }

    // 1. Find or create the Category
    const categoryRecord = await prisma.category.upsert({
      where: { name: data.category },
      update: {},
      create: { 
        name: data.category
      }
    });

    // 2. Create the Product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        barcode: data.barcode,
        brand: data.brand,
        uom: data.uom,
        costPrice: parseFloat(data.costPrice),
        sellingPrice: parseFloat(data.sellingPrice),
        markup: parseFloat(data.markup || 0),
        taxClass: data.taxClass || "Standard 16%",
        categoryId: categoryRecord.id,
        businessId: businessId,

        // 3. Create Inventory records
        inventory: {
          create: await Promise.all(data.inventory.map(async (item) => {
            const branchRecord = await prisma.branch.findFirst({
              where: { 
                name: item.branch,
                businessId: businessId 
              }
            });

            if (!branchRecord) {
              throw new Error(`Branch '${item.branch}' not found.`);
            }

            return {
              branchId: branchRecord.id,
              stock: parseInt(item.stock),
              minStock: parseInt(item.min)
            };
          }))
        }
      },
      include: { 
        inventory: {
          include: { branch: true }
        },
        category: true 
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

// ADD THIS BACK - This was the missing export causing the crash!
export const getAllProducts = async (req, res) => {
  try {
    const businessId = req.user?.businessId;
    
    const products = await prisma.product.findMany({
      where: { businessId: businessId }, // Only show products for this business
      include: { 
        inventory: {
          include: { branch: true }
        },
        category: true
      }
    });
    res.json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};