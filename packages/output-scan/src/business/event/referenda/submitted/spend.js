const { toDecimal128 } = require("../../../../utils");
const { handleWrappedCall } = require("../../../common/call");
const { insertReferendaReferendum } = require("../../../../mongo/service/referendaReferendum");
const { getCommonData } = require("./common");
const {
  call: { normalizeCall },
  utils: { bigAdd },
} = require("@osn/scan-common");

async function handleTreasurySpend(referendumIndex, trackId, proposalHash, call, indexer) {
  const spendCalls = [];
  await handleWrappedCall(call, null, indexer, [], innerCall => {
    const { section, method } = innerCall;
    if ("treasury" === section || "spend" === method) {
      spendCalls.push(innerCall);
    }
  });
  if (spendCalls.length <= 0) {
    return
  }

  const amount = spendCalls.reduce((result, call) => {
    const amount = call.args[0].toString();
    return bigAdd(result, amount);
  }, 0);
  const beneficiary = spendCalls[0].args[1].toString();

  const commonData = await getCommonData(referendumIndex, trackId, indexer);

  await insertReferendaReferendum({
    ...commonData,
    proposalHash,
    proposal: normalizeCall(call),
    amount,
    dValue: toDecimal128(amount),
    beneficiary,
  });
}

module.exports = {
  handleTreasurySpend,
}
