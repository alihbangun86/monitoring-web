const axios = require("axios");

async function test() {
  try {
    const response = await axios({
      url: "https://id.wikipedia.org",
      method: "GET",
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    console.log("Status:", response.status);
  } catch (err) {
    console.log(err.message);
  }
}

test();