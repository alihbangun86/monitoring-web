const db = require("../config/database");
const { getIPAddress, getGeoInfo } = require("../services/dnsService");

// GET
exports.getServices = async (req, res) => {

    const [rows] = await db.query(
        "SELECT * FROM services ORDER BY id DESC"
    );

    const services = await Promise.all(

        rows.map(async (service) => ({

            ...service,

            ip: await getIPAddress(service.url)

        }))

    );

    res.json(services);

};

// POST
exports.createService = async (req, res) => {

    const {
        name,
        url,
        category,
        interval_seconds
    } = req.body;

    await db.query(
        `INSERT INTO services
        (name,url,category,interval_seconds)
        VALUES (?,?,?,?)`,
        [name, url, category, interval_seconds]
    );

    res.json({
        message: "Service berhasil ditambahkan"
    });

};

// DELETE
exports.deleteService = async (req, res) => {

    await db.query(
        "DELETE FROM services WHERE id=?",
        [req.params.id]
    );

    res.json({
        message: "Service berhasil dihapus"
    });

};

exports.getServiceDetail = async (req, res) => {

    try {

        const { id } = req.params;

        const [[service]] = await db.query(`
            SELECT
                s.id,
                s.name,
                s.url,

                m.status,
                m.status_code,
                m.ping_ms,
                m.jitter_ms,
                m.packet_loss,
                m.response_time,
                m.error_message,
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

            WHERE s.id = ?
        `, [id]);

        if (!service) {
            return res.status(404).json({
                message: "Service tidak ditemukan"
            });
        }

        service.ip = await getIPAddress(service.url);
        const geoInfo = await getGeoInfo(service.ip);

        const [[statistics]] = await db.query(`
            SELECT

            COUNT(*) total_check,

            ROUND(AVG(ping_ms),0) average_ping,

            ROUND(AVG(jitter_ms),0) average_jitter,

            ROUND(AVG(packet_loss),2) average_packet_loss,

            ROUND(AVG(response_time),0) average_response,

            MIN(ping_ms) min_ping,
            MAX(ping_ms) max_ping,

            MIN(jitter_ms) min_jitter,
            MAX(jitter_ms) max_jitter,

            MIN(response_time) min_response,
            MAX(response_time) max_response,

            ROUND(
            (
            SUM(status='Online')
            /
            COUNT(*)
            )*100,
            2
            ) availability

            FROM monitoring_logs
            WHERE service_id=?
        `,[id]);

        const [history] = await db.query(`
            SELECT
                status,
                status_code,
                ping_ms,
                jitter_ms,
                packet_loss,
                response_time,
                error_message,
                checked_at

            FROM monitoring_logs

            WHERE service_id = ?

            ORDER BY checked_at DESC

            LIMIT 100
        `,[id]);

        res.json({

            service,

            statistics,

            history,
            geoInfo

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json(err);

    }

};

exports.getServiceHistory = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT

                DATE_FORMAT(checked_at,'%H:%i:%s') AS time,

                ping_ms,

                response_time,

                jitter_ms,

                packet_loss,

                status,

                status_code,

                checked_at

            FROM monitoring_logs

            WHERE service_id = ?

            ORDER BY checked_at DESC

            LIMIT 50
            `,
            [id]
        );

        res.json(rows.reverse());

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};