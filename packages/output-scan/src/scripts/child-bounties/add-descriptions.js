require("dotenv").config();

const {
  chain: { getApi },
} = require("@osn/scan-common");
const { getChildBountyCollection } = require("../../mongo");
const { getChildBountyAddedEventIndex } = require("../../business/event/child-bounties/added/description");
const { extractChildBountiesAddCalls } = require("../../business/common/call/childBounties/add");
const { updateChildBounty } = require("../../mongo/service/childBounty");

async function getChildBounties() {
  const col = await getChildBountyCollection();
  return await col.find({ description: null }).toArray();
}

async function handleOneChildBounty(api, childBounty) {
  const indexer = childBounty.indexer;
  const block = await api.rpc.chain.getBlock(indexer.blockHash);
  const blockEvents = await api.query.system.events.at(indexer.blockHash);
  const extrinsic = block.block.extrinsics[indexer.extrinsicIndex];
  const { index, meta } = childBounty;
  if (meta) {
    console.log(`Child bounty ${index} has meta, no need`);
    return null;
  }

  const eventIndexInExtrinsic = getChildBountyAddedEventIndex(blockEvents, indexer.extrinsicIndex, index);
  const calls = await extractChildBountiesAddCalls(extrinsic.method, indexer);
  const call = calls[eventIndexInExtrinsic];
  if (!call) {
    return null;
  }

  const value = call.args[1].toJSON();
  const description = call.args[2].toHuman();
  await updateChildBounty(index, { value, description, fee: 0 });
  console.log(`Child bounty ${index} handled`);
}

(async () => {
  const api = await getApi();
  const childBounties = await getChildBounties();
  for (const childBounty of childBounties) {
    await handleOneChildBounty(api, childBounty);
  }

  process.exit(0);
})();
