const { extractExtrinsicEvents } = require("../utils");
const { getExtrinsicCollection } = require("../mongo");
const { isExtrinsicSuccess } = require("../utils");
const { u8aToHex } = require("@polkadot/util");
const { extractExtrinsicBusinessData } = require("./extractBusiness");

async function handleExtrinsics(extrinsics = [], allEvents = [], indexer) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);

    await handleExtrinsic(
      extrinsic,
      {
        ...indexer,
        index: index++,
      },
      events
    );
  }
}

/**
 *
 * 解析并处理交易
 *
 */
async function handleExtrinsic(extrinsic, indexer, events) {
  const hash = extrinsic.hash.toHex();
  const callIndex = u8aToHex(extrinsic.callIndex);
  const { args } = extrinsic.method.toJSON();
  const name = extrinsic.method.methodName;
  const section = extrinsic.method.sectionName;
  let signer = extrinsic._raw.signature.get("signer").toString();
  //如果signer的解析长度不正确，则该交易是无签名交易
  if (signer.length < 48) {
    signer = "";
  }

  const isSuccess = isExtrinsicSuccess(events);

  await extractExtrinsicBusinessData(
    section,
    name,
    args,
    isSuccess,
    indexer,
    events
  );

  const version = extrinsic.version;
  const data = u8aToHex(extrinsic.data); // 原始数据

  const doc = {
    hash,
    indexer,
    signer,
    section,
    name,
    callIndex,
    version,
    args,
    data,
    isSuccess,
  };

  const exCol = await getExtrinsicCollection();
  const result = await exCol.insertOne(doc);
  if (result.result && !result.result.ok) {
    // FIXME: Deal with db failura
  }
}

module.exports = {
  handleExtrinsics,
};
