import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import productRoutes from "./routes/productRoutes.js";
import reportRoutes from "./routes/report.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import businessRoutes from "./routes/business.routes.js";

const app = express();

// 1. DYNAMIC ORIGIN
// We use process.env.FRONTEND_URL. If it's not set, we fall back to localhost.
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2. MIDDLEWARE
app.use(express.json());

// 3. ROUTES
app.use("/api/branches", branchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/business", businessRoutes);

app.get("/", (req, res) => {
  res.send("RetailCore POS Backend is running!");
});

export default app;
