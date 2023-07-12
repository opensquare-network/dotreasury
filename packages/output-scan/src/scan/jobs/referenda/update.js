import { getReferendaReferendumCol } from "../../../mongo";
import { getOngoingUpdates } from "../../../business/event/referenda/common/getOngoingUpdates";

async function updateReferendaReferendumInfo(referendumIndex, indexer) {
  const col = await getReferendaReferendumCol();
  const updates = await getOngoingUpdates(referendumIndex, indexer);
  await col.updateOne({
    referendumIndex,
    isFinal: false,
  }, {
    $set: updates,
  });
}

async function updateAllActiveReferenda(referendumIds, indexer) {
  if (referendumIds.length <= 0) {
    return;
  }

  let promises = [];
  for (const referendumIndex of referendumIds) {
    const promise = updateReferendaReferendumInfo(referendumIndex, indexer);
    promises.push(promise);
  }
  await Promise.all(promises);
}

module.exports = {
  updateAllActiveReferenda,
}
