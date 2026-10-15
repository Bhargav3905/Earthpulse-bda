import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    database: mongoose.connection.name,
    databaseConnected: mongoose.connection.readyState === 1,
    checkedAt: new Date(),
  });
});

export default router;
