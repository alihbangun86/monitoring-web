const { getIPAddress } = require("./services/dnsService");

(async () => {
    const ip = await getIPAddress("https://www.unila.ac.id");

    console.log(ip);
})();