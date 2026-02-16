import { registerOwnerService, loginService } from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // 'identifier' can be email OR staffNumber

    // 1. Determine if the user is logging in with Email or Staff Number
    const isEmail = identifier.includes("@");
    const queryField = isEmail ? { email: identifier } : { staffNumber: identifier };

    // 2. Find the user
    const user = await prisma.user.findUnique({
      where: queryField,
      include: {
        business: true,
        branches: {
          include: { branch: true }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Security Check: Status
    if (user.status !== "ACTIVE") {
      return res.status(403).json({ message: "Account disabled. Contact Admin." });
    }

    // 4. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 5. Generate Token
    const token = jwt.sign(
      { id: user.id, businessId: user.businessId },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        staffNumber: user.staffNumber,
        // Robust role check: prioritize owner role, else use branch role
        role: user.email === user.business.email ? "OWNER" : (user.branches[0]?.role || "CASHIER")
      },
      business: user.business,
      branches: user.branches.map(ub => ub.branch)
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
