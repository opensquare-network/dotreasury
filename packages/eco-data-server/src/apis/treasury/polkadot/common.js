const { u8aConcat } = require("@polkadot/util");
const { encodeAddress } = require("@polkadot/util-crypto");
const { getApis } = require("@osn/polkadot-api-container");
const { EMPTY_U8A_32 } = require("./consts");

function multiApiQuery(chain, fn) {
  return Promise.any(getApis(chain).map((api) => fn(api)));
}

function u8aConcatAddress(...args) {
  return encodeAddress(u8aConcat(...args, EMPTY_U8A_32).subarray(0, 32), 0);
}

function getTreasuryAddress() {
  return u8aConcatAddress("modlpy/trsry");
}

function uint16ToBytesLE(value) {
  const buffer = new ArrayBuffer(2);
  const view = new DataView(buffer);
  view.setUint16(0, value, true);
  return new Uint8Array(buffer);
}

function getBountyTreasuryAddress(bountyIndex) {
  return u8aConcatAddress("modlpy/trsry\x08bt", uint16ToBytesLE(bountyIndex));
}

module.exports = {
  multiApiQuery,
  getTreasuryAddress,
  getBountyTreasuryAddress,
};
