const {
  chain: { getLatestHeight }
} = require("@osn/scan-common");
const { getUnFinalReferenda } = require("../../../mongo/service/referendaReferendum");
const { updateAllActiveReferenda } = require("./update");
const { getAlarmedReferenda } = require("../../../store/referendaAlarm");

async function updateAllActive(indexer) {
  const all = await getUnFinalReferenda();
  const allIds = all.map(i => i.referendumIndex);
  await updateAllActiveReferenda(allIds, indexer);
}

async function handleReferenda(indexer) {
  const chainHeight = getLatestHeight();
  if (indexer.blockHeight < chainHeight - 100) {
    return;
  }

  if (indexer.blockHeight % 100 === 0) {
    await updateAllActive(indexer);
    return;
  }

  const ids = getAlarmedReferenda(indexer.blockHeight);
  await updateAllActiveReferenda(ids, indexer);
}

module.exports = {
  handleReferenda,
}
