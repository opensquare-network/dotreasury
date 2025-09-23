const dotenv = require("dotenv");
dotenv.config();

const {
  getIncomeInflationCollection,
  getStatusCollection,
} = require("../mongo/data");
const {
  chain: { getApi },
  utils: { bigAdd },
} = require("@osn/scan-common");
const {
  handleEraPaidWithoutTreasuryDeposit,
} = require("../business/event/staking/inflation/eraPaid");
const {
  getBlockIndexer,
} = require("@osn/scan-common/src/chain/utils/getBlockIndexer");

const mainScanName = "income-scan";

async function updateInflation(balance) {
  const statusCol = await getStatusCollection();
  const status = await statusCol.findOne({ name: mainScanName });
  if (!status) {
    console.error("No scan status found, can not update inflation");
    return;
  }
  const seats = status.seats;

  console.log("Current inflation:", seats.inflation);
  const inflation = bigAdd(seats.inflation || 0, balance);
  console.log("Adding inflation:", inflation);
  if (inflation) {
    await statusCol.findOneAndUpdate(
      { name: mainScanName },
      { $set: { "seats.inflation": inflation } },
    );
  }
}

async function handleOneEraPaid(blockHeight, eventIndex) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

  const blockEvents = await api.query.system.events.at(blockHash);
  const eraPaidEvent = blockEvents[eventIndex];
  if (!eraPaidEvent) {
    console.log(`No event found at #${blockHeight}-${eventIndex}`);
    return;
  }
  const { section, method } = eraPaidEvent.event;
  if (section !== "staking" || method !== "EraPaid") {
    console.log({ section, method });
    console.log(
      `The event at # ${blockHeight}-${eventIndex} is not era paid, skip`,
    );
    return;
  }

  const block = await api.rpc.chain.getBlock(blockHash);
  const blockIndexer = getBlockIndexer(block.block);

  console.log(`Handle era paid event at #${blockHeight}-${eventIndex}`);
  const balance = await handleEraPaidWithoutTreasuryDeposit(
    eraPaidEvent,
    { ...blockIndexer, eventIndex },
    blockEvents,
  );

  if (balance) {
    console.log("Found inflation:", balance);
    await updateInflation(balance);
  }
}

async function main() {
  const eventIndexers = require("./polkadot_erapaid_event")
    .map((eventIndex) => eventIndex.split("-"))
    .map(([blockHeight, eventIndex]) => ({
      blockHeight: parseInt(blockHeight),
      eventIndex: parseInt(eventIndex),
    }));

  const statusCol = await getStatusCollection();
  const status = await statusCol.findOne({ name: mainScanName });
  const scanHeight = status.height;
  console.log("Current scan height:", scanHeight);

  const inflationCol = await getIncomeInflationCollection();
  for (const { blockHeight, eventIndex } of eventIndexers) {
    if (blockHeight > scanHeight) {
      console.log(`Skip not scanned height #${blockHeight}`);
      continue;
    }
    const item = await inflationCol.findOne({
      "indexer.blockHeight": blockHeight,
    });
    if (item) {
      console.log(`Era paid at # ${blockHeight} already exist, skip`);
      continue;
    }
    await handleOneEraPaid(blockHeight, eventIndex);
  }
}

main()
  .catch(console.error)
  .then(() => process.exit());
