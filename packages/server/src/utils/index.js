const crypto = require("crypto");
const {
  cryptoWaitReady,
  encodeAddress,
  signatureVerify,
  decodeAddress,
} = require("@polkadot/util-crypto");
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

async function isValidSignature(signedMessage, signature, address) {
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

const ADMINS = (process.env.ADMINS || "").split("|");

async function checkAdmin(address, admins) {
  const adminsBuffers = admins
    .filter((addr) => !!addr)
    .map((addr) => decodeAddress(addr));

  const lookup = decodeAddress(address);
  return adminsBuffers.some((admin) => Buffer.compare(admin, lookup) === 0);
}

async function verifyAdminSignature(addressAndSignature, message, admins) {
  if (!addressAndSignature) {
    throw new HttpError(400, "Signature is missing");
  }

  const [address, signature] = addressAndSignature.split("/");
  if (!address || !signature) {
    throw new HttpError(400, "Signature is invalid");
  }

  const isAdmin = await checkAdmin(address, admins);
  if (!isAdmin) {
    throw new HttpError(401, "Unauthorized");
  }

  const isValid = await isValidSignature(message, signature, address);
  if (!isValid) {
    throw new HttpError(400, "Signature is invalid");
  }

  return true;
}

module.exports = {
  extractPage,
  isValidSignature,
  validateAddress,
  handler,
  bigAdd,
  md5,
  ADMINS,
  checkAdmin,
  verifyAdminSignature,
};
