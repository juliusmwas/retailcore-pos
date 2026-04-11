import { prisma } from "../lib/prisma.js";

export const updateBusinessSettings = async (req, res) => {
  try {
    const { name, address, phone, taxPercent, currency } = req.body;
    const { businessId } = req.user; // Grabbed from your authMiddleware

    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        name,
        address,
        phone,
        taxPercent: parseFloat(taxPercent),
        currency,
      },
    });

    res.status(200).json({
      success: true,
      business: updatedBusiness,
    });
  } catch (error) {
    console.error("Store Sync Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
