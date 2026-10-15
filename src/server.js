import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { syncEarthquakes } from "./services/earthquakeIngestion.js";

const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`EarthPulse running at http://localhost:${PORT}`);
  });

  // Initial sync when the server starts
  syncEarthquakes().catch((error) => {
    console.error("Initial earthquake sync failed:", error.message);
  });

  // Refresh every 60 seconds
  setInterval(() => {
    syncEarthquakes().catch((error) => {
      console.error("Scheduled earthquake sync failed:", error.message);
    });
  }, 60_000);
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exit(1);
}
