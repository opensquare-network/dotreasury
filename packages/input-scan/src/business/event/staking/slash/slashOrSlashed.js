const { getStakingSlashCollection } = require("../../../../mongo/data");
const {
  Modules,
  StakingEvents,
} = require("../../../common/constants")

async function handleSlashEvent(event, indexer) {
  const { section, method } = event;

  if (Modules.Staking !== section ||
    ![StakingEvents.Slash, StakingEvents.Slashed].includes(method)) {
    return
  }

  const validator = event.data[0].toString();
  const balance = event.data[1].toString();

  const obj = {
    indexer,
    section,
    method,
    validator,
    balance,
  }

  const col = await getStakingSlashCollection()
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleSlashEvent,
}
