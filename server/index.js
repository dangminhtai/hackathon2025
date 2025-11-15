// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import chatRoutes from "./routes/chatRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

// Routes
app.use("/api/chat", chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        error: err.message || "Internal server error",
    });
});

// Start server
async function startServer() {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
            console.log(`📡 API endpoints:`);
            console.log(`   - POST   /api/chat/send`);
            console.log(`   - GET    /api/chat/history`);
            console.log(`   - DELETE /api/chat/clear`);
        });
    } catch (error) {
        console.error("❌ Không thể khởi động server:", error);
        process.exit(1);
    }
}

startServer();

