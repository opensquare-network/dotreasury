const {
  consts: { Modules, ElectionsPhragmenEvents },
} = require("@osn/scan-common");
const {
  insertNewTermData,
} = require("../../mongo/services");

async function handleElectionNewTerm(event, indexer, extrinsic) {
  const { section, method } = event;
  if (
    ![
      Modules.ElectionsPhragmen,
      Modules.PhragmenElection,
    ].includes(section) ||
    ElectionsPhragmenEvents.NewTerm !== method
  ) {
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
  await insertNewTermData(indexer, { members });
}

module.exports = {
  handleElectionNewTerm,
}
