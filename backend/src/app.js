import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import staffRoutes from "./routes/staff.routes.js";

const app = express();

// 1. Configure CORS specifically for your Vite frontend
const corsOptions = {
  origin: "http://localhost:5173", // Your React URL
  credentials: true,               // Allows cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 2. Middleware (MUST come before Routes)
app.use(cors(corsOptions));
app.use(express.json());

// 3. Routes
app.use("/api/branches", branchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/staff", staffRoutes);

// Optional health check
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;