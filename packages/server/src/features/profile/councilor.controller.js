const {
  getTermsCollection,
  getMotionVoterCollection,
  getTipperCollection,
  getMotionCollection,
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

  const tipperCol = await getTipperCollection(chain);
  const items = await tipperCol.aggregate(
    [
      {
        $match: { tipper: address }
      },
      {
        $sort: { "indexer.blockHeight": -1 }
      },
      {
        $group: {
          _id: {
            tipHeight: "$tipHeight",
            tipHash: "$tipHash",
          },
          tips: {
            $push: {
              indexer: "$indexer",
              value: "$value",
            }
          },
        }
      },
      {
        $project: {
          _id: 0,
          tipHeight: "$_id.tipHeight",
          tipHash: "$_id.tipHash",
          tips: "$tips"
        }
      },
      {
        $sort: { tipHeight: -1 }
      },
    ]).toArray();

  ctx.body = items;
}

module.exports = {
  getCouncilorTerms,
  getMotionVoters,
  getTippers,
};
