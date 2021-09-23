const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");
const Hash = require("ipfs-only-hash");

const DECOO_API_TOKEN = process.env.DECOO_API_TOKEN;
if (!DECOO_API_TOKEN) {
  console.error("DECOO_API_TOKEN is not properly configured");
  process.exit();
}

const DECOO_API_SECRET_KEY = process.env.DECOO_API_SECRET_KEY;
if (!DECOO_API_SECRET_KEY) {
  console.error("DECOO_API_SECRET_KEY is not properly configured");
  process.exit();
}

const DECOO_API_OAUTH_ENDPOINT = process.env.DECOO_API_OAUTH_ENDPOINT;
if (!DECOO_API_OAUTH_ENDPOINT) {
  console.error("DECOO_API_OAUTH_ENDPOINT is not properly configured");
  process.exit();
}

const DECOO_API_UPLOAD_ENDPOINT = process.env.DECOO_API_UPLOAD_ENDPOINT;
if (!DECOO_API_UPLOAD_ENDPOINT) {
  console.error("DECOO_API_UPLOAD_ENDPOINT is not properly configured");
  process.exit();
}

const trimTailSlash = (url) =>
  url.endsWith("/") ? url.substr(0, url.length - 1) : url;

class IpfsService {
  async pinJsonToIpfsWithTimeout(data, timeout) {
    const errorMsg = "Pin json to ipfs timeout";
    return await Promise.race([
      new Promise((_, reject) => setTimeout(() => reject(new Error(errorMsg)), timeout)),
      this.pinJsonToIpfs(data),
    ]);
  }

  async pinJsonToIpfs(data) {
    const jsonData = JSON.stringify(data);
    const buf = Buffer.from(jsonData);
    const cid = await Hash.of(buf);
    const fullPrivateKey = `-----BEGIN PRIVATE KEY-----\n${DECOO_API_SECRET_KEY}\n-----END PRIVATE KEY-----`;
    const secret = crypto
      .privateEncrypt(fullPrivateKey, Buffer.from(cid))
      .toString("base64");
    const formdata = new FormData();
    formdata.append("file", buf, {
      filename: "grade-" + Date.now() + ".json",
      contentType: "application/json",
    });
    formdata.append("cid", cid);
    formdata.append("secret", secret);

    const tokenResult = await axios.get(
      `${trimTailSlash(DECOO_API_OAUTH_ENDPOINT)}/oauth/accessToken`,
      {
        headers: {
          authorization: `Bearer ${DECOO_API_TOKEN}`,
        },
      }
    );
    const accessToken = tokenResult.data.Data;

    const pinResult = await axios.post(
      `${trimTailSlash(DECOO_API_UPLOAD_ENDPOINT)}/pinning/pinFile`,
      formdata,
      {
        headers: {
          ...formdata.getHeaders(),
          useraccesstoken: accessToken,
        },
      }
    );

    return pinResult.data;
  }

}

module.exports = new IpfsService();
