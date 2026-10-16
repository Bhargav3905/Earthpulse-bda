import express from "express";
import cors from "cors";
import earthquakeRoutes from "./routes/earthquake.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import statusRoutes from "./routes/status.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "EarthPulse API is running" });
});

app.use("/api/earthquakes", earthquakeRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/status", statusRoutes);

export default app;
