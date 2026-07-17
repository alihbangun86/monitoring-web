const cron = require("node-cron");
const db = require("../config/database");
const { checkService } = require("../services/monitorService");
const { getIO } = require("../socket/socket");

cron.schedule("* * * * *", async () => {
  console.log("========================================");
  console.log("Checking services...");
  console.log(new Date().toLocaleString("id-ID"));
  console.log("========================================");

  try {
    const [services] = await db.query(
      "SELECT * FROM services WHERE is_active = 1"
    );

    if (services.length === 0) {
      console.log("Tidak ada service aktif.");
      return;
    }

    await Promise.all(
      services.map(async (service) => {
        try {
          await checkService(service);
        } catch (err) {
          console.error(`[${service.name}] ERROR:`, err.message);
        }
      })
    );

    // Kirim event ke semua client
    getIO().emit("dashboard-update");

    console.log("Dashboard realtime updated.");

    console.log("========================================");
    console.log("Monitoring selesai.");
    console.log("========================================\n");

  } catch (err) {
    console.error("Scheduler Error:", err.message);
  }
});