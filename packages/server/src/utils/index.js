const { decodeAddress, signatureVerify } = require('@polkadot/util-crypto');
const { u8aToHex } = require('@polkadot/util');

function extractPage(ctx) {
  const { page_size: queryPageSize, page: queryPage } = ctx.query;

  let pageSize;
  try {
    pageSize = parseInt(queryPageSize);
    pageSize = isNaN(pageSize) ? 10 : pageSize;
  } catch (e) {
    pageSize = 10;
  }

  let page;
  try {
    page = parseInt(queryPage);
    page = isNaN(page) ? 0 : page;
  } catch (e) {
    page = 0;
  }

  return {
    page,
    pageSize,
  };
}

function isValidSignature(signedMessage, signature, address) {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);
  const result = signatureVerify(signedMessage, signature, hexPublicKey);
  return result.isValid;
}

function handler(obj, method) {
  return obj[method].bind(obj);
}

module.exports = {
  extractPage,
  isValidSignature,
  handler,
};
