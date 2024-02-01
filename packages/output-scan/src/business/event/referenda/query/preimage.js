const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const isNil = require("lodash.isnil");

async function queryPreimageLenFromStatusFor(blockApi, hash) {
  const rawStatus = await blockApi.query.preimage.statusFor(hash);
  if (!rawStatus.isSome) {
    return null;
  }

  const status = rawStatus.unwrap();
  if (status.isRequested) {
    const requestedValue = status.asRequested;
    const optionLen = requestedValue.len;
    if (optionLen.isSome) {
      return optionLen.unwrap().toNumber();
    }
  } else if (status.isUnrequested) {
    return status.asUnrequested.len.toNumber();
  }

  return null;
}

async function queryPreimageLenFromRequestStatusFor(blockApi, hash) {
  const rawStatus = await blockApi.query.preimage.requestStatusFor(hash);
  if (!rawStatus.isSome) {
    return null;
  }

  const status = rawStatus.unwrap();
  if (status.isRequested) {
    const requestedValue = status.asRequested;
    const maybeLen = requestedValue.maybeLen;
    if (maybeLen.isSome) {
      return maybeLen.unwrap().toNumber();
    }
  } else if (status.isUnrequested) {
    return status.asUnrequested.len.toNumber();
  }

  return null;
}

async function queryPreimageLen(blockApi, hash) {
  let maybeLen;
  if (blockApi.query.preimage?.statusFor) {
    maybeLen = await queryPreimageLenFromStatusFor(blockApi, hash);
  }
  if (!isNil(maybeLen)) {
    return maybeLen;
  }

  if (blockApi.query.preimage?.requestStatusFor) {
    maybeLen = await queryPreimageLenFromRequestStatusFor(blockApi, hash);
  }
  if (!isNil(maybeLen)) {
    return maybeLen;
  }

  return null;
}

async function queryPreimageCallByLen(blockApi, hash, len) {
  const raw = await blockApi.query.preimage.preimageFor([hash, len]);
  if (!raw.isSome) {
    return null;
  }

  const bytes = raw.unwrap();
  try {
    return blockApi.registry.createType("Proposal", bytes);
  } catch (e) {
    return null
  }
}

async function queryCallFromPreimageFor(blockApi, toQueryHash) {
  const entries = await blockApi.query.preimage.preimageFor.entries();
  for (const [storageKey, rawPreimage] of entries) {
    if (!rawPreimage.isSome) {
      continue
    }

    const key = storageKey.args[0];
    const hash = key[0].toString();
    if (hash === toQueryHash) {
      try {
        return blockApi.registry.createType("Proposal", rawPreimage.unwrap());
      } catch (e) {
        return null
      }
    }
  }
}

async function queryCallFromPreimage(hash, blockHash) {
  const blockApi = await findBlockApi(blockHash);
  if (!blockApi.query.preimage) {
    return null;
  }

  const len = await queryPreimageLen(blockApi, hash);
  if (!isNil(len)) {
    return await queryPreimageCallByLen(blockApi, hash, len);
  }

  return await queryCallFromPreimageFor(blockApi, hash);
}

module.exports = {
  queryCallFromPreimage,
}
