const crypto = require("crypto");
const { decodeAddress, signatureVerify } = require("@polkadot/util-crypto");
const { u8aToHex } = require("@polkadot/util");
const BigNumber = require("bignumber.js");

function extractPage(ctx) {
  const { page_size: queryPageSize, page: queryPage } = ctx.query;

  let pageSize;
  try {
    pageSize = parseInt(queryPageSize);
    pageSize = isNaN(pageSize) ? 10 : Math.max(1, pageSize);
  } catch (e) {
    pageSize = 10;
  }

  let page;
  if (queryPage === "last") {
    page = queryPage;
  } else {
    try {
      page = parseInt(queryPage);
      page = isNaN(page) ? 0 : Math.max(0, page);
    } catch (e) {
      page = 0;
    }
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

function bigAdd(v1, v2) {
  return new BigNumber(v1).plus(v2).toString();
}

function md5(str) {
  const md5 = crypto.createHash("md5");
  return md5.update(str).digest("hex");
}

module.exports = {
  extractPage,
  isValidSignature,
  handler,
  bigAdd,
  md5,
};
