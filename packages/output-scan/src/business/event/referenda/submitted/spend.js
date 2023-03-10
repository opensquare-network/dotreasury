const { insertReferendaReferendum } = require("../../../../mongo/service/referendaReferendum");
const { getCommonData } = require("./common");
const {
  call: { normalizeCall }
} = require("@osn/scan-common");

async function handleTreasurySpend(referendumIndex, trackId, proposalHash, call, indexer) {
  const { section, method } = call;
  if ("treasury" !== section || "spend" !== method) {
    return
  }

  const amount = call.args[0].toString();
  const beneficiary = call.args[1].toString();

  const commonData = await getCommonData(referendumIndex, trackId, indexer);

  await insertReferendaReferendum({
    ...commonData,
    proposalHash,
    proposal: normalizeCall(call),
    amount,
    beneficiary,
  });
}

module.exports = {
  handleTreasurySpend,
}
