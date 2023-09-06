const { setReferendaDelegationMark } = require("../../../store/referendaDelegationMark");

async function handleReferendaDelegation(event, indexer) {
  const { section, method } = event;
  if ("convictionVoting" !== section) {
    return;
  }

  if (["Delegated", "Undelegated"].includes(method)) {
    setReferendaDelegationMark(indexer.blockHeight);
  }
}

module.exports = {
  handleReferendaDelegation,
}
