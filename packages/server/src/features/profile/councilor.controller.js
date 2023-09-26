const {
  getTermsCollection,
  getMotionCollection,
  getTipCollection,
} = require("../../mongo");
const rateService = require("../../services/rate.service");
const { extractPage } = require("../../utils");

async function getCouncilorTerms(ctx) {
  const { address } = ctx.params;

  const termsCol = await getTermsCollection();
  const items = await termsCol
    .aggregate([
      {
        $sort: {
          "indexer.blockHeight": -1,
        },
      },
      {
        $addFields: {
          members: {
            $filter: {
              input: "$members",
              as: "item",
              cond: { $eq: ["$$item.address", address] },
            },
          },
        },
      },
      {
        $addFields: {
          isCouncilor: { $ne: [{ $size: "$members" }, 0] },
        },
      },
      {
        $project: {
          _id: 0,
          members: 0,
          "indexer.blockHash": 0,
          "indexer.eventIndex": 0,
        },
      },
    ])
    .toArray();

  ctx.body = items;
}

async function getMotionVoters(ctx) {
  const { address } = ctx.params;

  const motionCol = await getMotionCollection();
  const items = await motionCol
    .aggregate([
      {
        $sort: {
          "indexer.blockHeight": -1,
          "indexer.eventIndex": -1,
        },
      },
      {
        $project: {
          _id: 0,
          motionHeight: "$indexer.blockHeight",
          motionHash: "$hash",
          motionIndex: "$index",
        },
      },
      {
        $lookup: {
          from: "motionVoter",
          let: { motionHeight: "$motionHeight", motionHash: "$motionHash" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$motionHeight", "$$motionHeight"] },
                    { $eq: ["$motionHash", "$$motionHash"] },
                    { $eq: ["$voter", address] },
                  ],
                },
              },
            },
            {
              $sort: {
                "indexer.blockHeight": -1,
                "indexer.eventIndex": -1,
              },
            },
            {
              $project: {
                _id: 0,
                aye: "$aye",
              },
            },
          ],
          as: "votes",
        },
      },
      {
        $project: {
          motionHash: 0,
        },
      },
    ])
    .toArray();

  ctx.body = items;
}

async function getTippers(ctx) {
  const { address } = ctx.params;
  const { from_time, to_time } = ctx.query;

  const q = {};

  if (from_time && to_time) {
    q.$and = [
      { "indexer.blockTime": { $gt: from_time } },
      { "indexer.blockTime": { $lt: to_time } },
    ];
  }

  const tipCol = await getTipCollection();
  const items = await tipCol
    .aggregate([
      { $match: q },
      {
        $sort: {
          "indexer.blockHeight": -1,
          "indexer.eventIndex": -1,
        },
      },
      {
        $project: {
          _id: 0,
          tipHeight: "$indexer.blockHeight",
          tipHash: "$hash",
        },
      },
      {
        $lookup: {
          from: "tipper",
          let: { tipHeight: "$tipHeight", tipHash: "$tipHash" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$tipHeight", "$$tipHeight"] },
                    { $eq: ["$tipHash", "$$tipHash"] },
                    { $eq: ["$tipper", address] },
                  ],
                },
              },
            },
            {
              $sort: {
                "indexer.blockHeight": -1,
                "indexer.eventIndex": -1,
              },
            },
            {
              $project: {
                _id: 0,
                value: "$value",
              },
            },
          ],
          as: "tips",
        },
      },
    ])
    .toArray();

  ctx.body = items;
}

async function getRates(ctx) {
  const { address } = ctx.params;

  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  ctx.body = await rateService.getRates(
    {
      chain: process.env.CHAIN,
      type: "councilor",
      index: address,
    },
    page,
    pageSize,
  );
}

async function getRateStats(ctx) {
  const { address } = ctx.params;

  ctx.body = await rateService.getRateStats({
    chain: process.env.CHAIN,
    type: "councilor",
    index: address,
  });
}

module.exports = {
  getCouncilorTerms,
  getMotionVoters,
  getTippers,
  getRates,
  getRateStats,
};
