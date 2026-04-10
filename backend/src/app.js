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

const app = express();

// 1. CONFIGURE CORS
// This handles the standard CORS handshake
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2. CUSTOM CORS OVERRIDE & PREFLIGHT
// This ensures the browser definitely sees the correct headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 3. MIDDLEWARE
app.use(express.json());

// 4. ROUTES
app.use("/api/branches", branchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
