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

export const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    const businessId = req.user?.businessId;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete associated inventory records
      // CHANGED: used 'productInventory' (matching your schema)
      await tx.productInventory.deleteMany({
        where: {
          productId: { in: ids }
        }
      });

      // 2. Delete the products themselves
      await tx.product.deleteMany({
        where: {
          id: { in: ids },
          businessId: businessId
        }
      });
    });

    res.status(200).json({ message: "Products deleted successfully" });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    res.status(500).json({ message: "Failed to delete products", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const businessId = req.user?.businessId;

    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Update the main Product details
      const product = await tx.product.update({
        where: { id: id, businessId: businessId },
        data: {
          name: data.name,
          sku: data.sku,
          barcode: data.barcode,
          brand: data.brand,
          uom: data.uom,
          costPrice: parseFloat(data.costPrice) || 0,
          sellingPrice: parseFloat(data.sellingPrice) || 0,
          markup: parseFloat(data.markup) || 0,
          category: {
            connectOrCreate: {
              where: { name: data.category },
              create: { name: data.category }
            }
          }
        },
        // Include inventory in the return so the frontend gets the full object
        include: { inventory: true } 
      });

      // 2. Update Inventory
      // The model name in Prisma Client is 'productInventory' (lowercase p)
      if (data.inventory && Array.isArray(data.inventory)) {
        for (const item of data.inventory) {
          await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: id,
                branchId: item.branchId
              }
            },
            update: {
              stock: parseInt(item.stock) || 0,
              minStock: parseInt(item.minStock) || 0
            },
            create: {
              productId: id,
              branchId: item.branchId,
              stock: parseInt(item.stock) || 0,
              minStock: parseInt(item.minStock) || 0
            }
          });
        }
      }

      return product;
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ 
      message: "Failed to update product", 
      error: error.message 
    });
  }
};