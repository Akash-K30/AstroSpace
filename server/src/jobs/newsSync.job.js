import cron from "node-cron";
import { executeNewsSync } from "../services/sync.service.js";

cron.schedule("*/30 * * * *", async () => {
    try {
        console.log("[Cron] Sync started");
        await executeNewsSync();
        console.log("[Cron] Sync completed successfully");
    } catch (error) {
        console.error("[Cron] Sync failed:", error);
    }
});