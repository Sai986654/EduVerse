import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables relative to current working directory
dotenv.config({ path: [path.join(process.cwd(), ".env.local"), path.join(process.cwd(), ".env")] });

// Import routes
import userRoutes from "./routes/userRoutes";
import courseRoutes from "./routes/courseRoutes";
import plannerRoutes from "./routes/plannerRoutes";
import chatRoutes from "./routes/chatRoutes";
import uploadRoutes from "./routes/uploadRoutes";

// Import search controller handler
import { searchCourses } from "./controllers/plannerController";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.use(express.json());

// Enable CORS for cross-origin frontend queries
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({
  origin: allowedOrigin === "*" ? true : allowedOrigin.split(","),
  credentials: true
}));

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);

// Root level search endpoint
app.post("/api/search", searchCourses);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend API Server running on http://localhost:${PORT}`);
});
