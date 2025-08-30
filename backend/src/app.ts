import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;
