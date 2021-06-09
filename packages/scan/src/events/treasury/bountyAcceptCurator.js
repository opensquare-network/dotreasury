const { MultisigMethods } = require("../../utils/constants");
const { Modules } = require("../../utils/constants");
const { getBountyMeta } = require("../../utils/bounty");

async function getRealSignerAndRemark(normalizedExtrinsic, extrinsic) {
  const { section, name, args, signer } = normalizedExtrinsic;
  if ([Modules.Treasury, Modules.Bounties].includes(section)) {
    return [signer, args["_remark"]];
  }

  const isMultisig =
    Modules.Multisig === section && MultisigMethods.asMulti === name;
}

async function handleBountyAcceptCurator(
  event,
  normalizedExtrinsic,
  extrinsic
) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);

  const timelineItem = {
    name: event.method,
    eventData,
    extrinsic: normalizedExtrinsic,
  };

  const data = {
    bountyIndex,
  };
}

module.exports = {
  handleBountyAcceptCurator,
};
