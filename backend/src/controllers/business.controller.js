import { prisma } from "../lib/prisma.js";

export const updateBusinessSettings = async (req, res) => {
  try {
    const { name, address, phone, taxPercent, currency } = req.body;
    const { businessId } = req.user; // Extract from authenticated token

    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        name,
        address,
        phone,
        taxPercent: parseFloat(taxPercent), // Ensure it's a float for Prisma
        currency,
      },
    });

    res.status(200).json({
      success: true,
      message: "Business settings updated successfully",
      business: updatedBusiness,
    });
  } catch (error) {
    console.error("Update Business Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getBusinessDetails = async (req, res) => {
  try {
    const { businessId } = req.user;
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });
    res.status(200).json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
