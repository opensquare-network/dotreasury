const { getTermsCollection } = require("../../mongo");

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

module.exports = {
  getCouncilorTerms,
};
