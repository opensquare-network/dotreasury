require("dotenv").config();

const { getReferendaReferendumCol, getReferendaReferendumTimelineCol } = require("../../../mongo");
const {
  chain: {
    getApi,
    getBlockIndexer,
  },
} = require("@osn/scan-common");
const { findScheduled } = require("../../../business/event/referenda/confirmed/scheduled");
const { handleDispatched } = require("../../../business/event/scheduler/dispatched");

async function main() {
  const referendumIndex = 512;
  const col = await getReferendaReferendumCol();
  const referendum = await col.findOne({ referendumIndex });
  if (!referendum) {
    console.log(`Not found referendum ${ referendumIndex }`);
    process.exit(0);
  }

  if (referendum.enactment) {
    console.log(`There is enactment object for referendum ${ referendumIndex }`);
    process.exit(0);
  }

  const timelineCol = await getReferendaReferendumTimelineCol();
  const timelineItems = await timelineCol.find({ referendumIndex }).sort({ "indexer.blockHeight": 1 }).toArray();
  const confirmedItem = timelineItems.find(item => "Confirmed" === item.name);

  const api = await getApi();
  let indexer = confirmedItem.indexer;
  let blockHash = await api.rpc.chain.getBlockHash(indexer.blockHeight);
  let blockEvents = await api.query.system.events.at(blockHash);
  let event = blockEvents[indexer.eventIndex].event;
  const enactment = await findScheduled(event, indexer, blockEvents);
  if (enactment) {
    await col.updateOne({ referendumIndex }, { $set: { enactment } });
    console.log(`Referendum ${ referendumIndex } enactment updated`);
  }

  const { when, index } = enactment;
  blockHash = await api.rpc.chain.getBlockHash(when);
  const block = await api.rpc.chain.getBlock(blockHash);
  blockEvents = await api.query.system.events.at(blockHash);
  const blockIndexer = getBlockIndexer(block.block);
  const eventIndex = blockEvents.findIndex(e => {
    const { section, method, data } = e.event;
    const taskAddress = data[0];
    return "scheduler" === section && "Dispatched" === method
      && taskAddress[0].toNumber() === when && taskAddress[1].toNumber() === index;
  });
  if (eventIndex < 0) {
    console.log(`Can not find the dispatched event`);
    process.exit(0);
  }

  event = blockEvents[eventIndex].event;
  indexer = { ...blockIndexer, eventIndex };
  await handleDispatched(event, indexer, null, blockEvents);
  console.log(`Referendum ${ referendumIndex } execution info updated`);
  process.exit(0);
}

main().then(() => console.log("done"));
