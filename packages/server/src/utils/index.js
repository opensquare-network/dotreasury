const crypto = require("crypto");
const {
  cryptoWaitReady,
  encodeAddress,
  signatureVerify,
} = require("@polkadot/util-crypto");
const { u8aToHex } = require("@polkadot/util");
const BigNumber = require("bignumber.js");
const { stringUpperFirst } = require("@polkadot/util");
const { SS58Format } = require("../contants");
const { HttpError } = require("../exc");

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
  await cryptoWaitReady();
  try {
    const result = signatureVerify(signedMessage, signature, address);
    return result.isValid;
  } catch (e) {
    return false;
  }
}

function validateAddress(address, chain) {
  const ss58Format = SS58Format[stringUpperFirst(chain)];
  if (ss58Format === undefined) {
    throw new HttpError(400, { chain: ["Unsupported relay chain."] });
  }

  const validAddress = encodeAddress(address, ss58Format);
  if (validAddress !== address) {
    throw new HttpError(400, {
      address: [`Not a valid ${chain} ss58format address.`],
    });
  }
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
  validateAddress,
  handler,
  bigAdd,
  md5,
};
