const { getParticipantCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

async function getParticipants(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const q = { proposer: address };
  const participantCol = await getParticipantCollection(chain);
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
