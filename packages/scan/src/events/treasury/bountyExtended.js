const { getBountyCollection } = require("../../mongo");
const { getCall, getMultiSigExtrinsicAddress } = require("../../utils/call");
const {
  BountyMethods,
  ProxyMethods,
  MultisigMethods,
  Modules,
} = require("../../utils/constants");
const { getBountyMeta } = require("../../utils/bounty");

function isBountyModule(section) {
  return [Modules.Treasury, Modules.Bounties].includes(section);
}

async function getRealSignerAndRemark(normalizedExtrinsic, extrinsic) {
  const { section, name, args, signer: extrinsicSigner } = normalizedExtrinsic;

  let signer, remark;
  if (
    [Modules.Treasury, Modules.Bounties].includes(section) &&
    BountyMethods.extendBountyExpiry
  ) {
    signer = extrinsicSigner;
    remark = args["_remark"];
  }
  if (Modules.Multisig === section && MultisigMethods.asMulti === name) {
    [signer, remark] = await tryGetRealSignerAndRemarkFromMulti(
      normalizedExtrinsic,
      extrinsic
    );
  } else if (Modules.Proxy !== section || ProxyMethods.proxy !== name) {
    [signer, remark] = await tryGetRealSignerAndRemarkFromProxy(
      normalizedExtrinsic,
      extrinsic
    );
  }

  return { signer, remark };
}

async function tryGetRealSignerAndRemarkFromMulti(
  normalizedExtrinsic,
  extrinsic
) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const blockHash = indexer.blockHash;
  const rawCall = extrinsic.method.args[3].toHex();
  const call = await getCall(blockHash, rawCall);

  if (BountyMethods.extendBountyExpiry === call.method) {
    const real = await getMultiSigExtrinsicAddress(
      normalizedExtrinsic.args,
      signer
    );
    return [real, call.args[1].toJSON()];
  }

  if (call.section === Modules.Proxy && call.method === ProxyMethods.proxy) {
    const proxyRawCall = call.args[2].toHex();
    const proxyCall = await getCall(blockHash, proxyRawCall);
    if (proxyCall.method === BountyMethods.extendBountyExpiry) {
      const real = call.toJSON().args.real;
      return [real, proxyCall.args[1].toJSON()];
    }
  }

  return [];
}

async function tryGetRealSignerAndRemarkFromProxy(
  normalizedExtrinsic,
  extrinsic
) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const callHex = extrinsic.args[1].toHex();
  const call = await getCall(indexer.blockHash, callHex);

  if (BountyMethods.extendBountyExpiry === call.method) {
    return [normalizedExtrinsic.args.real, call.args[1].toJSON()];
  }

  return [];
}

async function handleBountyExtended(event, normalizedExtrinsic, extrinsic) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const signerAndRemark = await getRealSignerAndRemark(
    normalizedExtrinsic,
    extrinsic
  );
  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);

  const timelineItem = {
    name: event.method,
    eventData,
    extrinsic: {
      ...normalizedExtrinsic,
      name: BountyMethods.extendBountyExpiry,
      signer: signerAndRemark.signer,
      args: {
        ...normalizedExtrinsic.args,
        _remark: signerAndRemark.remark,
      },
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
  handleBountyExtended,
};
