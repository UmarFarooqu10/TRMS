import app from "./app.js";
import { env } from "../config/env.js";
import { sequelize } from "../config/database.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
})();
