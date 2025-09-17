const dotenv = require("dotenv");
dotenv.config();

const omit = require("lodash.omit");
const {
  chain: { getApi },
  consts: { Modules, StakingEvents },
} = require("@osn/scan-common");
const {
  getOthersIncomeCollection,
  getIncomeInflationCollection,
} = require("../mongo/data");

function isTreasuryDeposit(section, method) {
  return Modules.Treasury === section && "Deposit" === method;
}

function isBalancesIssued(section, method) {
  return Modules.Balances === section && "Issued" === method;
}

function isBalancesDeposit(section, method) {
  return Modules.Balances === section && "Deposit" === method;
}

function isEraPaid(section, method) {
  return section === Modules.Staking && method === StakingEvents.EraPaid;
}

async function isEraPaidIncome(income) {
  const { indexer } = income;
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(indexer.blockHeight);
  const blockEvents = await api.query.system.events.at(blockHash);

  if (indexer.eventIndex < 3) {
    return false;
  }

  const incomeEvent = blockEvents[indexer.eventIndex];
  const { section, method } = incomeEvent.event;
  const prev1Event = blockEvents[indexer.eventIndex - 1];
  const { section: prev1Section, method: prev1Method } = prev1Event.event;
  const prev2Event = blockEvents[indexer.eventIndex - 2];
  const { section: prev2Section, method: prev2Method } = prev2Event.event;
  const prev3Event = blockEvents[indexer.eventIndex - 3];
  const { section: prev3Section, method: prev3Method } = prev3Event.event;

  return (
    isTreasuryDeposit(section, method) &&
    isBalancesDeposit(prev1Section, prev1Method) &&
    isBalancesIssued(prev2Section, prev2Method) &&
    isEraPaid(prev3Section, prev3Method)
  );
}

async function moveOthersIncomeToInflation(othersIncome) {
  console.log(
    `Move othersIncome at #${othersIncome.indexer.blockHeight} to inflation`,
  );
  const inflationCol = await getIncomeInflationCollection();
  await inflationCol.insertOne(omit(othersIncome, ["_id"]));

  const othersIncomeCol = await getOthersIncomeCollection();
  await othersIncomeCol.deleteOne({ _id: othersIncome._id });
}

async function main() {
  const col = await getOthersIncomeCollection();
  const items = await col
    .find({
      "indexer.extrinsicIndex": null,
    })
    .toArray();

  for (const othersIncome of items) {
    const isEraPaid = await isEraPaidIncome(othersIncome);
    if (!isEraPaid) {
      console.log(`Skip othersIncome at #${othersIncome.indexer.blockHeight}`);
      continue;
    }
    await moveOthersIncomeToInflation(othersIncome);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
