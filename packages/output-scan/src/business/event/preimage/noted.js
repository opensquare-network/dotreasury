const { toDecimal128 } = require("../../../utils");
const { extractTreasuryCalls } = require("../referenda/common/extractTreasury");
const { queryCallFromPreimage } = require("../referenda/query/preimage");
const {
  findReferendaPendingReferendum,
  insertReferendaReferendum,
  deleteReferendaPendingReferendum,
} = require("../../../mongo/service");
const {
  call: { normalizeCall },
} = require("@osn/scan-common");

async function handlePreimageNoted(event, indexer) {
  const hash = event.data[0].toString();

  const pendingReferendum = await findReferendaPendingReferendum(hash);
  if (!pendingReferendum) {
    return
  }

  const call = await queryCallFromPreimage(hash, indexer.blockHash);
  const { calls, amount, beneficiary, beneficiaries } = await extractTreasuryCalls(call, indexer);
  if (calls) {
    await insertReferendaReferendum({
      ...pendingReferendum,
      proposal: normalizeCall(call),
      amount,
      value: amount,
      dValue: toDecimal128(amount),
      beneficiary,
      beneficiaries,
    });
  }

  await deleteReferendaPendingReferendum(hash);
}

module.exports = {
  handlePreimageNoted,
}
