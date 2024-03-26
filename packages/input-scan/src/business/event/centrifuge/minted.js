const {
  env: { currentChain },
  consts: {
    Modules,
  }
} = require("@osn/scan-common");

function isNextEventValid(indexer, blockEvents) {
  const nextEvent = blockEvents[indexer.eventIndex + 1];
  const { section, method } = nextEvent.event;
  return "blockRewards" === section && "NewSession" === method;
}

function handleBalancesMinted(event, indexer, blockEvents) {
  if ("centrifuge" !== currentChain()) {
    return;
  }
  const { section, method, data } = event;
  if (section !== Modules.Balances || "Minted" !== method) {
    return;
  }

  if (!isNextEventValid(indexer, blockEvents)) {
    return;
  }

  if ("4dpEcgqJRyJK3J8Es6v8ZfVntV7c64Ysgcjd4hYwyGoFPWbg" !== data[0].toString()) {
    return;
  }

  const obj = {
    indexer,
    section: "blockRewards",
    method: "NewSession",
    balance: data[1].toString(),
  }

  return data[1].toString();
}

module.exports = {
  handleBalancesMinted,
}
