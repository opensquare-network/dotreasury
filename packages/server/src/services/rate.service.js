const { ObjectId } = require("mongodb");
const {
  getRateCollection, getReactionCollection,
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
      throw new HttpError(400, "Treasury type is missing");
    }

    if (!data.chain) {
      throw new HttpError(400, "Chain is missing");
    }

    let indexer = null;

    if ("tip" === type) {
      if (!hash) {
        throw new HttpError(400, "Hash is missing");
      }

      if (!blockHeight) {
        throw new HttpError(400, "Block height is missing");
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
        throw new HttpError(400, "Proposal index is missing");
      }

      indexer = {
        chain,
        type: "proposal",
        index
      };
    } else if ("bounty" === type) {
      if (!index) {
        throw new HttpError(400, "Bounty index is missing");
      }

      indexer = {
        chain,
        type: "bounty",
        index
      };
    } else {
      throw new HttpError(400, "Unknown treasury type");
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

    const existRate = await rateCol.findOne({ indexer, "data.address": address });
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

  async getRates(indexer, page, pageSize, user) {
    const rateCol = await getRateCollection();

    const q = {
      indexer,
      "data.comment": { $ne: null },
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
      {
        $lookup: {
          from: "reaction",
          let: { rateId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$rateId", "$$rateId"],
                },
              },
            },
            {
              $group: {
                _id: "$reaction",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                reaction: "$_id",
                count: 1,
              },
            },
          ],
          as: "reactions",
        },
      },
      ...(user
        ? [
            {
              $lookup: {
                from: "reaction",
                let: { rateId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$rateId", "$$rateId"] },
                          { $eq: ["$userId", user._id] },
                        ],
                      },
                    },
                  },
                ],
                as: "myReaction",
              },
            },
            {
              $addFields: {
                myReaction: {
                  $arrayElemAt: ["$myReaction.reaction", 0],
                },
              },
            },
          ]
        : []),
    ]).toArray();

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

  async unsetRateReaction(rateId, user) {
    const reactionCol = await getReactionCollection();

    const result = await reactionCol.deleteOne({
      rateId: ObjectId(rateId),
      userId: user._id,
    });

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, clean reaction.");
    }

    if (result.result.nModified === 0) {
      return false;
    }

    return true;
  }

  async setRateReaction(rateId, reaction, user) {
    const reactionCol = await getReactionCollection();

    const now = new Date();
    const result = await reactionCol.updateOne(
      {
        rateId: ObjectId(rateId),
        userId: user._id,
      },
      {
        $set: {
          reaction,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, update reaction.");
    }

    return true;
  }

}

module.exports = new RateService();
