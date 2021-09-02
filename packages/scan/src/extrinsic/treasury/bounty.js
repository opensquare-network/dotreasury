const { getBountyMeta } = require("../../events/treasury/bounty/utils");
const { getCall, getMultiSigExtrinsicAddress } = require("../../utils/call");
const {
  BountyMethods,
  Modules,
  MultisigMethods,
  ProxyMethods,
} = require("../../utils/constants");
const { getBountyCollection } = require("../../mongo");
const { getApi } = require("../../api");

function isBountyModule(section) {
  return [Modules.Treasury, Modules.Bounties].includes(section);
}

async function tryGetInfoFromMulti(normalizedExtrinsic, extrinsic) {
  const { section, name, args, signer } = normalizedExtrinsic;
  const isMultisig =
    Modules.Multisig === section && MultisigMethods.asMulti === name;
  if (!isMultisig) {
    return [];
  }

  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const blockHash = indexer.blockHash;
  const rawCall = extrinsic.method.args[3].toHex();
  const call = await getCall(blockHash, rawCall);

  if (BountyMethods.acceptCurator === call.method) {
    const real = await getMultiSigExtrinsicAddress(args, signer);
    return [real, call.args[0].toJSON()];
  }

  if (call.section === Modules.Proxy && call.method === ProxyMethods.proxy) {
    const proxyRawCall = call.args[2].toHex();
    const proxyCall = await getCall(blockHash, proxyRawCall);
    if (proxyCall.method === BountyMethods.acceptCurator) {
      const real = call.toJSON().args.real;
      return [real, proxyCall.args[0].toJSON()];
    }
  }

  return [];
}

async function tryGetInfoFromProxy(normalizedExtrinsic, extrinsic) {
  const { section, name, args } = normalizedExtrinsic;
  if (Modules.Proxy !== section || ProxyMethods.proxy !== name) {
    return [];
  }

  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const callHex = extrinsic.args[2].toHex();
  const call = await getCall(indexer.blockHash, callHex);

  if (BountyMethods.acceptCurator === call.method) {
    return [args.real, call.args[0].toJSON()];
  }

  return [];
}

async function handleBountyAcceptCurator(normalizedExtrinsic, extrinsic) {
  const { section, name, args } = normalizedExtrinsic;
  const indexer = normalizedExtrinsic.extrinsicIndexer;

  let bountyIndex;
  let signer;
  const isAcceptCuratorCall =
    isBountyModule(section) && BountyMethods.acceptCurator === name;
  if (isAcceptCuratorCall) {
    bountyIndex = args["bounty_id"];
    signer = normalizedExtrinsic.signer;
  }
  if (typeof bountyIndex === "undefined") {
    [signer, bountyIndex] =
      (await tryGetInfoFromMulti(normalizedExtrinsic, extrinsic)) || [];
  }
  if (typeof bountyIndex === "undefined") {
    [signer, bountyIndex] =
      (await tryGetInfoFromProxy(normalizedExtrinsic, extrinsic)) || [];
  }
  if (typeof bountyIndex === "undefined") {
    return;
  }

  const api = await getApi();
  const meta = await getBountyMeta(api, indexer.blockHash, bountyIndex);

  const timelineItem = {
    name: BountyMethods.acceptCurator,
    extrinsic: {
      ...normalizedExtrinsic,
      name: BountyMethods.acceptCurator,
      signer,
    },
  };

  const bountyCol = await getBountyCollection();
  await bountyCol.findOneAndUpdate(
    { bountyIndex },
    {
      $set: { meta },
      $push: { timeline: timelineItem },
    }
  );
}

module.exports = {
  handleBountyAcceptCurator,
};
