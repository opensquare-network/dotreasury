const { isElectionModule } = require("./common");
const {
  consts: { ElectionsPhragmenEvents },
} = require("@osn/scan-common");
const {
  upsertTerm,
  batchUpsertTermCouncilor,
} = require("../../mongo/services");

async function handleElectionNewTerm(event, indexer, extrinsic) {
  const { section, method } = event;
  if (!isElectionModule(section) || ElectionsPhragmenEvents.NewTerm !== method) {
    return
  }

  let members = [];
  for (const [account, balance] of event.data[0]) {
    const address = account.toString();

    members.push({
      address,
      balance: balance.toBigInt().toString(),
    })
  }

  await upsertTerm(indexer, members);
  await batchUpsertTermCouncilor(indexer.blockHeight, members);
}

module.exports = {
  handleElectionNewTerm,
}
