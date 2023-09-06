const {
  chain: { getApi, findBlockApi }
} = require("@osn/scan-common");
const diff = require("lodash.difference");

async function getCouncilMembers(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const blockApi = await api.at(blockHash);

  const raw = await blockApi.query.council.members();
  return raw.toJSON()
}

async function getSwitchedCouncilMembers(height) {
  const oldMembers = await getCouncilMembers(height - 1);
  const newMembers = await getCouncilMembers(height);

  const removedMembers = diff(oldMembers, newMembers);
  const addedMembers = diff(newMembers, oldMembers);

  return {
    removedMembers,
    addedMembers,
  }
}

async function getTermDuration(blockHash, blockHeight) {
  const blockApi = await findBlockApi(blockHash);
  if (blockApi.consts.electionsPhragmen) {
    return blockApi.consts.electionsPhragmen.termDuration.toNumber();
  } else if (blockApi.consts.phragmenElection) {
    return blockApi.consts.phragmenElection.termDuration.toNumber();
  }

  throw new Error(`Can not get term duration at ${ blockHeight }`)
}

module.exports = {
  getCouncilMembers,
  getSwitchedCouncilMembers,
  getTermDuration,
}
