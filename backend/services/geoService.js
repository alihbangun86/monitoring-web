const axios = require("axios");

async function getGeoInfo(ip) {
  try {
    const { data } = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,org,as`
    );

    if (data.status !== "success") {
      return null;
    }

    return {
      location: `${data.city}, ${data.regionName}, ${data.country}`,
      organization: data.org,
      isp: data.isp,
      asn: data.as,
    };
  } catch (err) {
    return null;
  }
}

module.exports = {
  getGeoInfo,
};