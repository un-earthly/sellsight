import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
    console.log("Shutting down gracefully...");
    server.close(() => process.exit(0));
});
