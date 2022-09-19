const {
  getTermsCollection,
  getMotionVoterCollection,
  getTipperCollection,
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

  const motionVoterCol = await getMotionVoterCollection(chain);
  const items = await motionVoterCol.aggregate(
    [
      {
        $match: { voter: address }
      },
      {
        $sort: { "indexer.blockHeight": -1 }
      },
      {
        $group: {
          _id: {
            motionHeight: "$motionHeight",
            motionHash: "$motionHash",
          },
          votes: {
            $push: {
              indexer: "$indexer",
              aye: "$aye",
            }
          },
        }
      },
      {
        $project: {
          _id: 0,
          motionHeight: "$_id.motionHeight",
          motionHash: "$_id.motionHash",
          votes: "$votes"
        }
      },
      {
        $sort: { motionHeight: -1 }
      }
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
