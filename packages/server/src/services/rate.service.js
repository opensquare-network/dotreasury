const { ObjectId } = require("mongodb");
const {
  getRateCollection,
} = require("../mongo-admin");
const { HttpError } = require("../exc");
const { isValidSignature } = require("../utils");

class RateService {
  async verifySignature(signature, data) {
    if (!signature) {
      throw new HttpError(400, "Signature is missing");
    }

    if (!data.address) {
      throw new HttpError(400, "data.address is missing");
    }

    const isValid = isValidSignature(JSON.stringify(data), signature, data.address);
    if (!isValid) {
      throw new HttpError(400, "Signature is invalid");
    }

    return true;
  }

  async addRate(data, signature) {
    await this.verifySignature(signature, data);

    const {
      chain,
      type,
      blockHeight,
      hash,
      index,
      grade,
      comment,
      timestamp,
      version,
      address,
    } = data;

    if (!data.type) {
      throw new HttpError(400, "data.type is missing");
    }

    if (!data.chain) {
      throw new HttpError(400, "data.chain is missing");
    }

    let indexer = null;

    if ("tip" === type) {
      if (!hash) {
        throw new HttpError(400, "data.hash is missing");
      }

      if (!blockHeight) {
        throw new HttpError(400, "data.blockHeight is missing");
      }

      indexer = {
        chain,
        type: "tip",
        index: {
          blockHeight,
          tipHash: hash,
        }
      };
    } else if ("treasury_proposal" === type) {
      if (!index) {
        throw new HttpError(400, "data.index is missing");
      }

      indexer = {
        chain,
        type: "proposal",
        index
      };
    } else if ("bounty" === type) {
      if (!index) {
        throw new HttpError(400, "data.index is missing");
      }

      indexer = {
        chain,
        type: "bounty",
        index
      };
    } else {
      throw new HttpError(400, "Unknown data.type");
    }

    if (grade < 1 || grade > 5) {
      throw new HttpError(400, "data.grade must between 1 to 5");
    }

    if (typeof comment !== "string") {
      throw new HttpError(400, "data.comment must be string");
    }

    if (comment.length > 140) {
      throw new HttpError(400, "data.comment too long");
    }

    if (!timestamp) {
      throw new HttpError(400, "data.timestamp is missing");
    }

    if (!version) {
      throw new HttpError(400, "data.version is missing");
    }

    const rateCol = await getRateCollection();

    const existRate = await rateCol.findOne({ indexer, address });
    if (existRate) {
      throw new HttpError(400, "You had already rated");
    }

    const now = new Date();
    const result = await rateCol.insertOne(
      {
        indexer,
        data,
        signature,
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
    const total = await rateCol.countDocuments({ indexer });

    if (page === "last") {
      const totalPages = Math.ceil(total / pageSize);
      page = totalPages - 1;
    }

    const rates = await rateCol
      .find({ indexer })
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();

    return {
      items: rates,
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
          _id: grade,
          count: { $sum: 1 }
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
