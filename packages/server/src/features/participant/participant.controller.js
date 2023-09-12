const { getParticipantCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

async function getParticipants(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  const { role } = ctx.request.query;

  const q = { proposer: address };
  if (role === "beneficiary") {
    q.isBeneficiary = true;
  } else if (role === "proposer") {
    q.isProposer = true;
  } else if (role === "councilor") {
    q.isCouncilor = true;
  }

  const participantCol = await getParticipantCollection();
  const total = await participantCol.countDocuments(q);
  const items = await participantCol
    .find(q)
    .sort({ total: -1 })
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
