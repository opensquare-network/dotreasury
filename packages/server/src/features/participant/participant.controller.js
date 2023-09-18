const { getParticipantCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

async function getParticipants(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  const { role } = ctx.request.query;

  const q = { proposer: address };
  let sort = { "totalFiatValue.total": -1 };
  if (role === "beneficiary") {
    q.isBeneficiary = true;
    sort = { "totalFiatValue.totalBenefit": -1 };
  } else if (role === "proposer") {
    q.isProposer = true;
    sort = { "totalFiatValue.totalProposed": -1 };
  } else if (role === "councilor") {
    q.isCouncilor = true;
  }

  const participantCol = await getParticipantCollection(chain);
  const total = await participantCol.countDocuments(q);
  const items = await participantCol
    .find(q)
    .sort(sort)
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getParticipants,
};
