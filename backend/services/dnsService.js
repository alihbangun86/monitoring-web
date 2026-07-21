const dns = require("dns").promises;
const { getGeoInfo } = require("./geoService");

async function getIPAddress(url) {
    try {
        const hostname = new URL(url).hostname;

        const result = await dns.lookup(hostname);

        return result.address;
    } catch (err) {
        console.error("DNS Lookup Error:", err.message);
        return null;
    }
}

module.exports = {
    getIPAddress,
    getGeoInfo,
};