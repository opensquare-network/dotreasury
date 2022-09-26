const {
  getTermsCollection,
  getMotionCollection,
  getTipCollection,
} = require("../../mongo");

async function getCouncilorTerms(ctx) {
  const { chain, address } = ctx.params;

  const termsCol = await getTermsCollection(chain);
  const items = await termsCol.aggregate(
    [
      {
        $sort: {
          "indexer.blockHeight": -1
        }
      },
      {
        $addFields: {
          members: {
            $filter: {
              input: "$members",
              as: "item",
              cond: { $eq: ["$$item.address", address] },
            }
          },
        }
      },
      {
        $addFields: {
          member: { $first: "$members" },
          isCouncilor: { $ne: [{ $size: "$members" }, 0] }
        }
      },
      {
        $project: {
          members: 0,
        }
      }
    ]).toArray();

  ctx.body = items;
}

async function getMotionVoters(ctx) {
  const { chain, address } = ctx.params;

  const motionCol = await getMotionCollection(chain);
  const items = await motionCol.aggregate(
    [
      {
        $sort: {
          "indexer.blockHeight": -1,
          "indexer.eventIndex": -1,
        }
      },
      {
        $project: {
          _id: 0,
          motionHeight: "$indexer.blockHeight",
          motionHash: "$hash",
          motionIndex: "$index",
        }
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
                  ]
                }
              }
            },
            {
              $sort: {
                "indexer.blockHeight": -1,
                "indexer.eventIndex": -1,
              }
            },
            {
              $project: {
                _id: 0,
                indexer: "$indexer",
                aye: "$aye",
              }
            }
          ],
          as: "votes",
        }
      },
    ]).toArray();

  ctx.body = items;
}

async function getTippers(ctx) {
  const { chain, address } = ctx.params;
  const { from_time, to_time } = ctx.query;

  const q = {};

  if (from_time && to_time) {
    q.$and = [
      { "indexer.blockTime": { $gt: from_time } },
      { "indexer.blockTime": { $lt: to_time } },
    ];
  }

  const tipCol = await getTipCollection(chain);
  const items = await tipCol.aggregate(
    [
      { $match: q },
      {
        $sort: {
          "indexer.blockHeight": -1,
          "indexer.eventIndex": -1,
        }
      },
      {
        $project: {
          _id: 0,
          tipHeight: "$indexer.blockHeight",
          tipHash: "$hash",
        }
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
                  ]
                }
              }
            },
            {
              $sort: {
                "indexer.blockHeight": -1,
                "indexer.eventIndex": -1,
              }
            },
            {
              $project: {
                _id: 0,
                indexer: "$indexer",
                value: "$value",
              }
            }
          ],
          as: "tips",
        }
      },
    ]).toArray();

  ctx.body = items;
}

module.exports = {
  getCouncilorTerms,
  getMotionVoters,
  getTippers,
};
