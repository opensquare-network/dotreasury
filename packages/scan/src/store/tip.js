const {
  TipEvents,
  ProxyMethods,
  TipMethods,
  Modules,
  MultisigMethods,
} = require("../utils/constants");
const { hexToString } = require("@polkadot/util");
const { getTipCollection } = require("../mongo");
const { getApi } = require("../api");
const {
  median,
  getMetadataConstByBlockHash,
  getMetadataConstsByBlockHash,
} = require("../utils");
const { getCall, getMultiSigExtrinsicAddress } = require("../utils/call");
const { getTipMethodNameAndArgs } = require("./utils");

async function getTipMetaByBlockHeight(height, tipHash) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  return await getTipMeta(blockHash, tipHash);
}

async function getTipMeta(blockHash, tipHash) {
  const api = await getApi();
  let rawMeta;
  if (api.query.tips) {
    rawMeta = await api.query.tips.tips.at(blockHash, tipHash);
  } else {
    rawMeta = await api.query.treasury.tips.at(blockHash, tipHash);
  }
  // FIXME: We should not change the origin meta data
  // if (meta?.reason) {
  //   const rawReasonText = await api.query.tips.reasons.at(blockHash, meta.reason);
  //   meta.reasonText = rawReasonText.toHuman() || reasonFromArgs;
  // }
  // if (meta?.closes) {
  //   meta.tipCountdown = api.consts.treasury.tipCountdown.toNumber();
  // }
  // if (meta?.tips) {
  //   const members = await api.query.electionsPhragmen.members.at(blockHash);
  //   meta.tippers = members.map(item => item[0].toJSON());
  // }

  return rawMeta.toJSON();
}

async function getReasonStorageReasonText(reasonHash, blockHash) {
  const api = await getApi();

  const rawReasonText = await api.query.tips.reasons.at(blockHash, reasonHash);
  return rawReasonText.toHuman();
}

async function getTippersCount(blockHash) {
  const oldModuleValue = await getMetadataConstByBlockHash(
    blockHash,
    "ElectionsPhragmen",
    "DesiredMembers"
  );

  if (oldModuleValue) {
    return oldModuleValue.toNumber();
  }

  const newModuleValue = await getMetadataConstByBlockHash(
    blockHash,
    "PhragmenElection",
    "DesiredMembers"
  );

  return newModuleValue ? newModuleValue.toNumber() : newModuleValue;
}

async function getTipFindersFee(blockHash) {
  const constants = await getMetadataConstsByBlockHash(blockHash, [
    {
      moduleName: "Tips",
      constantName: "TipFindersFee",
    },
    {
      moduleName: "Treasury",
      constantName: "TipFindersFee",
    },
  ]);

  return (constants[0] ?? constants[1])?.toJSON();
}

function computeTipValue(tipMeta) {
  const tipValues = (tipMeta?.tips ?? []).map((tip) => tip[1]);
  return median(tipValues);
}

async function getTipReason(normalizedExtrinsic, extrinsic) {
  const { section, name, args } = normalizedExtrinsic;

  if (name === ProxyMethods.proxy) {
    return hexToString(args.call.args.reason);
  }

  if ([TipMethods.tipNew, TipMethods.reportAwesome].includes(name)) {
    return hexToString(args.reason);
  }

  if (Modules.Multisig === section || MultisigMethods.asMulti === name) {
    // handle multisig transaction
    const rawCall = extrinsic.method.args[3].toHex();
    const call = await getCall(
      normalizedExtrinsic.extrinsicIndexer.blockHash,
      rawCall
    );
    if (
      Modules.Treasury !== call.section ||
      [TipMethods.tipNew, TipMethods.reportAwesome].includes(call.method)
    ) {
      return;
    }

    const {
      args: { reason },
    } = call.toJSON();
    return hexToString(reason);
  }

  return null;
}

async function getRealSigner(normalizedExtrinsic) {
  const { section, name, args, signer } = normalizedExtrinsic;

  if (name === ProxyMethods.proxy) {
    return args.real;
  }

  if (Modules.Multisig === section || MultisigMethods.asMulti === name) {
    // handle multisig transaction
    return await getMultiSigExtrinsicAddress(args, signer);
  }

  return signer;
}

async function saveNewTip(hash, normalizedExtrinsic, extrinsic) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;

  const finder = await getRealSigner(normalizedExtrinsic);
  const meta = await getTipMeta(indexer.blockHash, hash);
  const reason =
    (await getTipReason(normalizedExtrinsic, extrinsic)) ||
    (await getReasonStorageReasonText(meta?.reason, indexer.blockHash));
  const medianValue = computeTipValue(meta);
  const tippersCount = await getTippersCount(indexer.blockHash);
  const tipFindersFee = await getTipFindersFee(indexer.blockHash);

  const [method, args] = await getTipMethodNameAndArgs(
    normalizedExtrinsic,
    extrinsic,
    reason
  );

  const tipCol = await getTipCollection();
  await tipCol.insertOne({
    indexer,
    hash,
    reason,
    finder,
    medianValue,
    meta,
    tippersCount,
    tipFindersFee,
    isClosedOrRetracted: false,
    state: {
      indexer: normalizedExtrinsic.extrinsicIndexer,
      state: TipEvents.NewTip,
      data: [hash],
    },
    timeline: [
      {
        type: "extrinsic",
        method,
        args: {
          ...args,
          finder,
        },
        extrinsicIndexer: indexer,
      },
    ],
  });
}

async function updateTipByClosingEvent(hash, state, data, extrinsic) {
  const blockHash = extrinsic.extrinsicIndexer.blockHash;
  const meta = await getTipMeta(blockHash, hash);
  const tippersCount = await getTippersCount(blockHash);
  const tipFindersFee = await getTipFindersFee(blockHash);
  const updates = {
    tippersCount,
    tipFindersFee,
    meta,
    medianValue: computeTipValue(meta),
  };

  const tipCol = await getTipCollection();
  await tipCol.updateOne(
    { hash, isClosedOrRetracted: false },
    { $set: updates }
  );
}

async function updateTipFinalState(
  hash,
  eventMethod,
  data,
  normalizedExtrinsic,
  extrinsic
) {
  const indexer = normalizedExtrinsic.extrinsicIndexer;
  const meta = await getTipMetaByBlockHeight(indexer.blockHeight - 1, hash);
  const updates = {
    isClosedOrRetracted: true,
    meta,
    state: { indexer, state: eventMethod, data },
  };

  const [method, args] = await getTipMethodNameAndArgs(
    normalizedExtrinsic,
    extrinsic
  );
  const terminator = await getRealSigner(normalizedExtrinsic);

  const tipCol = await getTipCollection();
  await tipCol.updateOne(
    { hash, isClosedOrRetracted: false },
    {
      $set: updates,
      $push: {
        timeline: {
          type: "extrinsic",
          method,
          args: {
            ...args,
            terminator,
          },
          extrinsicIndexer: indexer,
        },
      },
    }
  );
}

module.exports = {
  saveNewTip,
  updateTipFinalState,
  updateTipByClosingEvent,
  getTippersCount,
  getTipMeta,
  computeTipValue,
  getTipMetaByBlockHeight,
};
