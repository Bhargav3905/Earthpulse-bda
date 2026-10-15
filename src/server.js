import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`EarthPulse running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exit(1);
}