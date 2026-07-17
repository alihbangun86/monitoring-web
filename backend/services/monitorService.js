const axios = require("axios");
const ping = require("ping");
const db = require("../config/database");

/*
====================================================
HTTP PERFORMANCE TEST
====================================================
Mengirim 10 HTTP Request untuk mendapatkan:

- Average Response Time
- Min Response Time
- Max Response Time
- HTTP Jitter
- Packet Loss
- HTTP Status
====================================================
*/

async function getHttpPerformance(service) {

    const samples = [];

    let packetLoss = 0;

    let statusCode = null;

    for (let i = 0; i < 10; i++) {

        const start = process.hrtime.bigint();

        try {

            const response = await axios({

                method: service.method || "GET",

                url: service.url,

                timeout:
                    (service.timeout_seconds || 10) * 1000,

                maxRedirects: 5,

                validateStatus: () => true,

                headers: {

                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",

                    Accept:
                        "text/html,application/xhtml+xml",

                },

            });

            const end = process.hrtime.bigint();

            const responseTime = Math.round(

                Number(end - start) / 1_000_000

            );

            samples.push(responseTime);

            statusCode = response.status;

        } catch (err) {

            packetLoss++;

        }

    }

    /*
    ==========================================
    Semua Request Gagal
    ==========================================
    */

    if (samples.length === 0) {

        return {

            averageResponse: null,

            minResponse: null,

            maxResponse: null,

            jitter: null,

            packetLoss: 100,

            statusCode: null,

        };

    }

    /*
    ==========================================
    Average Response
    ==========================================
    */

    const averageResponse = Math.round(

        samples.reduce(

            (a, b) => a + b,

            0

        ) / samples.length

    );

    /*
    ==========================================
    Min & Max
    ==========================================
    */

    const minResponse = Math.min(...samples);

    const maxResponse = Math.max(...samples);

    /*
    ==========================================
    HTTP Jitter
    (Average Difference)
    ==========================================
    */

    let totalDifference = 0;

    for (

        let i = 1;

        i < samples.length;

        i++

    ) {

        totalDifference += Math.abs(

            samples[i] -

            samples[i - 1]

        );

    }

    const jitter = Math.round(

        totalDifference /

        (samples.length - 1)

    );

    /*
    ==========================================
    Packet Loss
    ==========================================
    */

    const packetLossPercent = Number(

        (

            packetLoss /

            10

        ).toFixed(2)

    ) * 100;

    return {

        averageResponse,

        minResponse,

        maxResponse,

        jitter,

        packetLoss: packetLossPercent,

        statusCode,

    };

}

/*
====================================================
CHECK SERVICE
====================================================
*/

async function checkService(service) {

    /*
    ==========================================
    ICMP PING
    ==========================================
    */

    let pingMs = null;

    try {

        const host = new URL(service.url).hostname;

        const pingResult = await ping.promise.probe(host, {

            timeout: 3,

        });

        if (pingResult.alive) {

            pingMs = Math.round(

                Number(pingResult.time)

            );

        }

    } catch (err) {

        pingMs = null;

    }

    /*
    ==========================================
    HTTP PERFORMANCE
    ==========================================
    */

    const result = await getHttpPerformance(service);

    const {

        averageResponse,

        minResponse,

        maxResponse,

        jitter,

        packetLoss,

        statusCode,

    } = result;

    /*
    ==========================================
    STATUS SERVICE
    ==========================================
    */

    let status = "Offline";

    if (statusCode !== null) {

        if (statusCode >= 200 && statusCode < 300) {

            status = "Online";

        }

        else if (statusCode >= 300 && statusCode < 400) {

            status = "Redirect";

        }

        else if (statusCode === 401) {

            status = "Unauthorized";

        }

        else if (statusCode === 403) {

            status = "Forbidden";

        }

        else if (statusCode === 404) {

            status = "Not Found";

        }

        else if (statusCode >= 500) {

            status = "Server Error";

        }

        else {

            status = "Unknown";

        }

    }

    /*
    ==========================================
    ERROR MESSAGE
    ==========================================
    */

    let errorMessage = null;

    if (packetLoss === 100) {

        errorMessage =

            "Semua HTTP Request gagal.";

    }

    /*
    ==========================================
    SAVE TO DATABASE
    ==========================================
    */

    try {

        await db.query(

            `
            INSERT INTO monitoring_logs
            (
                service_id,
                status,
                status_code,
                ping_ms,
                response_time,
                min_response_ms,
                max_response_ms,
                jitter_ms,
                packet_loss,
                error_message
            )
            VALUES
            (
                ?,?,?,?,?,?,?,?,?,?
            )
            `,

            [

                service.id,

                status,

                statusCode,

                pingMs,

                averageResponse,

                minResponse,

                maxResponse,

                jitter,

                packetLoss,

                errorMessage,

            ]

        );

    } catch (err) {

        console.error(

            "Database Error :",

            err.message

        );

    }

    /*
    ==========================================
    LOG MONITORING
    ==========================================
    */

    console.log("");

    console.log(
        "===================================================="
    );

    console.log(
        `SERVICE      : ${service.name}`
    );

    console.log(
        `STATUS       : ${status}`
    );

    console.log(
        `HTTP STATUS  : ${statusCode ?? "-"}`
    );

    console.log(
        `PING         : ${pingMs ?? "RTO"} ms`
    );

    console.log(
        `AVG RESPONSE : ${averageResponse ?? "-"} ms`
    );

    console.log(
        `MIN RESPONSE : ${minResponse ?? "-"} ms`
    );

    console.log(
        `MAX RESPONSE : ${maxResponse ?? "-"} ms`
    );

    console.log(
        `HTTP JITTER  : ${jitter ?? "-"} ms`
    );

    console.log(
        `PACKET LOSS  : ${packetLoss} %`
    );

    console.log(
        "===================================================="
    );

}

module.exports = {

    checkService,

};