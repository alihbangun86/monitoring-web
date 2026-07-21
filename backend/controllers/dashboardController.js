const db = require("../config/database");
const { getIPAddress } = require("../services/dnsService");
const { getGeoInfo } = require("../services/geoService");

// =====================
// Summary Dashboard
// =====================
exports.getSummary = async (req, res) => {
  try {
    const [[total]] = await db.query(
      "SELECT COUNT(*) AS total FROM services"
    );

    const [[online]] = await db.query(`
      SELECT COUNT(*) AS total
      FROM (
        SELECT service_id, status
        FROM monitoring_logs
        WHERE id IN (
          SELECT MAX(id)
          FROM monitoring_logs
          GROUP BY service_id
        )
      ) x
      WHERE status = 'Online'
    `);

    const [[offline]] = await db.query(`
      SELECT COUNT(*) AS total
      FROM (
        SELECT service_id, status
        FROM monitoring_logs
        WHERE id IN (
          SELECT MAX(id)
          FROM monitoring_logs
          GROUP BY service_id
        )
      ) x
      WHERE status <> 'Online'
    `);

    res.json({
      total: total.total,
      online: online.total,
      offline: offline.total,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json(err);

  }
};

// =====================
// Service Status
// =====================
exports.getServiceStatus = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        s.id,
        s.name,
        s.url,

        m.status,
        m.status_code,

        m.ping_ms,
        m.jitter_ms,
        m.response_time,

        m.checked_at

      FROM services s

      LEFT JOIN monitoring_logs m
      ON m.id = (
        SELECT id
        FROM monitoring_logs
        WHERE service_id = s.id
        ORDER BY checked_at DESC
        LIMIT 1
      )

      ORDER BY s.name
    `);

    const services = await Promise.all(

      rows.map(async (service) => {

        const ip = await getIPAddress(service.url);

        let geoInfo = null;

        if (ip) {
          geoInfo = await getGeoInfo(ip);
        }

        return {
          ...service,
          ip,
          geoInfo,
        };

      })

    );

    res.json(services);

  } catch (err) {

    console.error(err);

    res.status(500).json(err);

  }

};

// =====================
// Dashboard Chart
// =====================
exports.getChart = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
          DATE_FORMAT(checked_at,'%H:%i') AS time,
          ROUND(AVG(ping_ms),0) AS ping,
          ROUND(AVG(jitter_ms),0) AS jitter,
          ROUND(AVG(response_time),0) AS response
      FROM monitoring_logs
      WHERE checked_at >= NOW() - INTERVAL 30 MINUTE
      GROUP BY time
      ORDER BY time ASC
    `);

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Internal Server Error"
    });

  }

};