function isBountyEvent(method) {
  return [
    "BountyProposed",
    "BountyRejected",
    "BountyBecameActive",
    "BountyAwarded",
    "BountyClaimed",
    "BountyCanceled",
    "BountyExtended",
  ].includes(method);
}

async function handleBountyEvent(method, jsonData, indexer, sort) {
  if (isBountyEvent(method)) {
    return;
  }

  if (method === "BountyProposed") {
    const [index] = jsonData;
  } else if (method === "BountyRejected") {
    const [index, balance] = jsonData;
  } else if (method === "BountyBecameActive") {
    const [index] = jsonData;
  } else if (method === "BountyAwarded") {
    const [index, accountId] = jsonData;
  } else if (method === "BountyClaimed") {
    const [index, balance, accountId] = jsonData;
  } else if (method === "BountyCanceled") {
    const [index] = jsonData;
  } else if (method === "BountyExtended") {
    const [index] = jsonData;
  }
}

module.exports = {
  handleBountyEvent,
};
