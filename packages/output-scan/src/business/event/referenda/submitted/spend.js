const { extractTreasuryCalls } = require("../common/extractTreasury");
const { toDecimal128 } = require("../../../../utils");
const { insertReferendaReferendum } = require("../../../../mongo/service/referendaReferendum");
const { getCommonData } = require("./common");
const {
  call: { normalizeCall },
} = require("@osn/scan-common");

async function handleTreasurySpend(referendumIndex, trackId, proposalHash, call, indexer) {
  const { calls, amount, beneficiary, beneficiaries } = await extractTreasuryCalls(call, indexer);
  if (!calls) {
    return
  }

  const commonData = await getCommonData(referendumIndex, trackId, indexer);
  await insertReferendaReferendum({
    ...commonData,
    proposalHash,
    proposal: normalizeCall(call),
    amount,
    value: amount,
    dValue: toDecimal128(amount),
    beneficiary,
    beneficiaries,
  });
}

module.exports = {
  handleTreasurySpend,
}
