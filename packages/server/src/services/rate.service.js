const { stringUpperFirst } = require("@polkadot/util");
const { encodeAddress } = require("@polkadot/util-crypto");
const ipfsService = require("./ipfs.service");
const { getRateCollection } = require("../mongo-admin");
const { HttpError } = require("../exc");
const { isValidSignature } = require("../utils");
const { SS58Format } = require("../contants");


const IPFS_ENDPOINT = process.env.IPFS_ENDPOINT;
if (!IPFS_ENDPOINT) {
  console.error("IPFS_ENDPOINT is not properly configured");
  process.exit();
}

const trimTailSlash = (url) =>
  url.endsWith("/") ? url.substr(0, url.length - 1) : url;

function getIndexer(chain, type, index) {
  if (index === undefined) {
    throw new HttpError(400, "Index is missing");
  }

  return {
    chain,
    type,
    index,
  };
}

class RateService {
  async verifySignature(msg, address, signature) {
    if (!signature) {
      throw new HttpError(400, "Signature is missing");
    }

    if (!address) {
      throw new HttpError(400, "Address is missing");
    }

    const isValid = await isValidSignature(msg, signature, address);
    if (!isValid) {
      throw new HttpError(400, "Signature is invalid");
    }

    return true;
  }

  async addRate(data, address, signature) {
    const msg = JSON.stringify(data);
    await this.verifySignature(msg, address, signature);

    const { chain, type, index, grade, comment, timestamp, version } = data;

    if (!type) {
      throw new HttpError(400, "Treasury type is missing");
    }

    if (!chain) {
      throw new HttpError(400, "Chain is missing");
    }

    const ss58Format = SS58Format[stringUpperFirst(chain)];
    const encodedAddress = encodeAddress(address, ss58Format ?? SS58Format.Substrate);

    let indexer = null;

    if (
      [
        "treasury_proposal",
      ].includes(type)
    ) {
      indexer = getIndexer(chain, "proposal", index);
    } else if ("councilor" === type) {
      indexer = getIndexer(chain, "councilor", index);
    } else if ("user" === type) {
      indexer = getIndexer(chain, "user", index);
    } else if ("project" === type) {
      if (index === undefined) {
        throw new HttpError(400, "Index is missing");
      }
      indexer = { type: "project", index };
    } else {
      throw new HttpError(400, "Unsupport vote type");
    }

    if (grade < 1 || grade > 5) {
      throw new HttpError(400, "Number of grade must between 1 to 5");
    }

    if (comment?.length > 280) {
      throw new HttpError(400, "Comment too long");
    }

    if (!timestamp) {
      throw new HttpError(400, "Timestamp is missing");
    }

    if (!version) {
      throw new HttpError(400, "Version is missing");
    }

    let pinHash = undefined;
    try {
      const added = await ipfsService.pinJsonToIpfsWithTimeout({
        msg,
        address: encodedAddress,
        signature,
        version: "1",
      }, 3000);
      pinHash = added?.cid?.toV1().toString();
    } catch (e) {
      console.error(e);
    }

    const now = new Date();

    const rateCol = await getRateCollection();
    const result = await rateCol.updateOne(
      {
        indexer, address: encodedAddress
      },
      {
        $set: {
          data,
          signature,
          pinHash,
          version: "1",
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        }
      },
      { upsert: true }
    );

    if (!result.acknowledged) {
      throw new HttpError(500, "Add rate error");
    }

    return true;
  }

  async getRates(indexer, page, pageSize) {
    const rateCol = await getRateCollection();

    const q = {
      indexer,
    };

    const total = await rateCol.countDocuments(q);

    if (page === "last") {
      const totalPages = Math.ceil(total / pageSize);
      page = Math.max(0, totalPages - 1);
    }

    const rates = await rateCol
      .aggregate([
        { $match: q },
        { $sort: { createdAt: 1 } },
        { $skip: page * pageSize },
        { $limit: pageSize },
      ])
      .toArray();

    const ipfsEndpoint = trimTailSlash(IPFS_ENDPOINT);
    return {
      items: rates.map((r) => ({ ...r, ipfsEndpoint })),
      page,
      pageSize,
      total,
    };
  }

  async getRateStats(indexer) {
    const rateCol = await getRateCollection();

    const stat = await rateCol
      .aggregate([
        { $match: { indexer } },
        {
          $group: {
            _id: "$data.grade",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const result = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    for (const { _id, count } of stat) {
      result[_id] = count;
    }

    return result;
  }
}

module.exports = new RateService();
