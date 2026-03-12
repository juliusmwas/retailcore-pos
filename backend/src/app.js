import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import productRoutes from './routes/productRoutes.js';

const app = express();

// 1. CONFIGURE CORS
// This handles the standard CORS handshake
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. CUSTOM CORS OVERRIDE & PREFLIGHT
// This ensures the browser definitely sees the correct headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
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
app.use('/api/products', productRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;