const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");
const Hash = require("ipfs-only-hash");
const { ObjectId } = require("mongodb");
const {
  getRateCollection, getReactionCollection,
} = require("../mongo-admin");
const { HttpError } = require("../exc");
const { isValidSignature } = require("../utils");

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

const DECOO_IPFS_ENDPOINT = process.env.DECOO_IPFS_ENDPOINT;
if (!DECOO_IPFS_ENDPOINT) {
  console.error("DECOO_IPFS_ENDPOINT is not properly configured");
  process.exit();
}

const trimTailSlash = (url) => url.endsWith("/") ? url.substr(0, url.length - 1) : url;


function getIndexer(chain, type, index) {
  if (!index) {
    throw new HttpError(400, "Index is missing");
  }

  return {
    chain,
    type,
    index
  };
}

async function pinJsonToIpfs(data) {
  const jsonData = JSON.stringify(data);
  const buf = Buffer.from(jsonData);
  const cid = await Hash.of(buf);
  const fullPrivateKey = `-----BEGIN PRIVATE KEY-----\n${DECOO_API_SECRET_KEY}\n-----END PRIVATE KEY-----`;
  const secret = crypto.privateEncrypt(fullPrivateKey, Buffer.from(cid)).toString("base64");
  const formdata = new FormData();
  formdata.append("file", buf, { filename: "grade-" + Date.now() + ".json", contentType: "application/json" });
  formdata.append("cid", cid);
  formdata.append("secret", secret);

  const tokenResult = await axios.get(`${trimTailSlash(DECOO_API_OAUTH_ENDPOINT)}/oauth/accessToken`, {
    headers: {
      authorization: `Bearer ${DECOO_API_TOKEN}`,
    }
  });
  const accessToken = tokenResult.data.Data;

  const pinResult = await axios.post(`${trimTailSlash(DECOO_API_UPLOAD_ENDPOINT)}/pinning/pinFile`, formdata, {
    headers: {
      ...formdata.getHeaders(),
      useraccesstoken: accessToken,
    }
  });

  return pinResult.data;
}

class RateService {
  async verifySignature(msg, address, signature) {
    if (!signature) {
      throw new HttpError(400, "Signature is missing");
    }

    if (!address) {
      throw new HttpError(400, "Address is missing");
    }

    const isValid = isValidSignature(msg, signature, address);
    if (!isValid) {
      throw new HttpError(400, "Signature is invalid");
    }

    return true;
  }

  async addRate(data, address, signature) {
    const msg = JSON.stringify(data);
    await this.verifySignature(msg, address, signature);

    const {
      chain,
      type,
      index,
      grade,
      comment,
      timestamp,
      version,
    } = data;

    if (!type) {
      throw new HttpError(400, "Treasury type is missing");
    }

    if (!chain) {
      throw new HttpError(400, "Chain is missing");
    }

    let indexer = null;

    if ("treasury_proposal" === type) {
      indexer = getIndexer(chain, "proposal", index);
    } else if ("project" === type) {
      indexer = getIndexer(chain, "project", index);
    } else {
      throw new HttpError(400, "Unsupport treasury type");
    }

    if (grade < 1 || grade > 5) {
      throw new HttpError(400, "Number of grade must between 1 to 5");
    }

    if (comment?.length > 140) {
      throw new HttpError(400, "Comment too long");
    }

    if (!timestamp) {
      throw new HttpError(400, "Timestamp is missing");
    }

    if (!version) {
      throw new HttpError(400, "Version is missing");
    }

    const rateCol = await getRateCollection();

    const existRate = await rateCol.findOne({ indexer, address });
    if (existRate) {
      throw new HttpError(400, "You had already rated");
    }

    const pinResult = await pinJsonToIpfs({ msg, address, signature, version: "1" });
    if (!pinResult.PinHash) {
      throw new HttpError(500, "Failed to pin to ipfs");
    }

    const now = new Date();
    const result = await rateCol.insertOne(
      {
        indexer,
        data,
        address,
        signature,
        pinHash: pinResult.PinHash,
        version: "1",
        createdAt: now,
        updatedAt: now,
      });

    if (!result.result.ok) {
      throw new HttpError(500, "Add rate error");
    }

    const rateId = result.ops[0]._id;

    return rateId;
  }

  async getRates(indexer, page, pageSize) {
    const rateCol = await getRateCollection();

    const q = {
      indexer,
    };

    const total = await rateCol.countDocuments(q);

    if (page === "last") {
      const totalPages = Math.ceil(total / pageSize);
      page = totalPages - 1;
    }

    const rates = await rateCol.aggregate([
      { $match: q },
      { $sort: { createdAt: 1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
    ]).toArray();

    const ipfsEndpoint = trimTailSlash(DECOO_IPFS_ENDPOINT);
    return {
      items: rates.map(r => ({...r, ipfsEndpoint})),
      page,
      pageSize,
      total,
    };
  }

  async getRateStats(indexer) {
    const rateCol = await getRateCollection();

    const stat = await rateCol.aggregate([
      { $match: { indexer } },
      {
        $group: {
          _id: "$data.grade",
          count: { $sum: 1 },
        }
      },
    ]).toArray();

    const result = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    for (const {_id, count} of stat) {
      result[_id] = count;
    }

    return result;
  }
}

module.exports = new RateService();
