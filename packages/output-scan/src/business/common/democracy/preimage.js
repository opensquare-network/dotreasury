const { chain: { findBlockApi } } = require("@osn/scan-common");
const { hexToU8a } = require("@polkadot/util");

function getNormalizedPreimageStorage(raw) {
  if (!raw.isSome) {
    return;
  }

  const unwrapped = raw.unwrap();
  if (unwrapped.asAvailable) {
    return raw.unwrap().asAvailable.toJSON();
  }

  const unwrappedJson = raw.unwrap().toJSON();
  if (Array.isArray(unwrappedJson)) {
    return {
      data: unwrappedJson[0],
      provider: unwrappedJson[1],
      deposit: unwrappedJson[2],
      since: unwrappedJson[3],
      expiry: unwrappedJson[4] || null,
    }
  }

  throw new Error("Unknown image storage data structure")
}

async function queryPreimageCall(hash, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.democracy.preimages(hash);
  const availableImage = getNormalizedPreimageStorage(raw)
  if (!availableImage) {
    return null;
  }

  try {
    const dataU8a = hexToU8a(availableImage.data);
    return blockApi.registry.createType("Proposal", dataU8a);
  } catch (e) {
    return null
  }
}

module.exports = {
  queryPreimageCall,
}
