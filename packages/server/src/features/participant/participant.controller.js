const { getParticipantCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

async function getParticipant(ctx) {
  const { address } = ctx.params;

  const participantCol = await getParticipantCollection();
  const data = await participantCol.findOne({ address });
  if (!data) {
    ctx.throw(404, "Participant not found");
    return;
  }

  ctx.body = data;
}

async function getParticipants(ctx) {
  const { page, pageSize } = extractPage(ctx);
  const { role } = ctx.request.query;

  const q = {};
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
    .sort({ "totalFiatValue.totalBenefit": -1 })
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
  getParticipant,
  getParticipants,
};
