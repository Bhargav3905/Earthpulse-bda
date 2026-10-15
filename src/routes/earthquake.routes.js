import { Router } from "express";
import { syncEarthquakes } from "../services/earthquakeIngestion.js";

const router = Router();

router.post("/sync", async (req, res, next) => {
  try {
    const result = await syncEarthquakes();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
