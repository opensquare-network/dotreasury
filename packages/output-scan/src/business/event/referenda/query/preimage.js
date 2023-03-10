const {
  chain: { findBlockApi },
} = require("@osn/scan-common");

async function queryPreimage(hash, blockHash) {
  const blockApi = await findBlockApi(blockHash);
  const status = await blockApi.query.preimage.statusFor(hash);
  if (!status.isSome) {
    return null;
  }

  const len = Object.values(status.toJSON())[0].len;
  const raw = await blockApi.query.preimage.preimageFor([hash, len]);
  if (!raw.isSome) {
    return null;
  }

  try {
    return blockApi.registry.createType("Proposal", raw.unwrap());
  } catch (e) {
    return null
  }
}

module.exports = {
  queryPreimage,
}
