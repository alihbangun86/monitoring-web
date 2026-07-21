const db = require("../config/database");
const { getIPAddress } = require("../services/dnsService");
const { getGeoInfo } = require("../services/geoService");

exports.getServiceDetail = async (req, res) => {
  try {
    const { id } = req.params;

    /*
    ==========================================
    SERVICE
    ==========================================
    */

    const [serviceRows] = await db.query(
      `
      SELECT
        id,
        name,
        url,
        method,
        timeout_seconds
      FROM services
      WHERE id = ?
      `,
      [id]
    );

    if (serviceRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service tidak ditemukan",
      });
    }

    const service = serviceRows[0];

    /*
    ==========================================
    IP ADDRESS
    ==========================================
    */

    const ip = await getIPAddress(service.url);

    /*
    ==========================================
    GEO INFO
    ==========================================
    */

    let geoInfo = null;

    if (ip) {
      geoInfo = await getGeoInfo(ip);
    }

    /*
    ==========================================
    LAST MONITORING
    ==========================================
    */

    const [monitorRows] = await db.query(
      `
      SELECT
        status,
        status_code,
        ping_ms,
        response_time,
        min_response_ms,
        max_response_ms,
        jitter_ms,
        packet_loss,
        checked_at
      FROM monitoring_logs
      WHERE service_id = ?
      ORDER BY checked_at DESC
      LIMIT 1
      `,
      [id]
    );

    const monitoring =
      monitorRows.length > 0 ? monitorRows[0] : null;

    /*
    ==========================================
    RESPONSE
    ==========================================
    */

    return res.json({
      success: true,

      service: {
        ...service,
        ip,
      },

      monitoring,

      geoInfo,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};