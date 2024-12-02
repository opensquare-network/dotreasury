const {
  multiApiQuery,
  getTreasuryAddress,
  getBountyTreasuryAddress,
} = require("./common");

async function getPolkadotTreasuryAccount(api) {
  const address = getTreasuryAddress();
  const account = await api.query.system.account(address);
  return account.toJSON();
}

async function getTreasuryDotOnRelayChain() {
  return await multiApiQuery("polkadot", (api) =>
    getPolkadotTreasuryAccount(api),
  );
}

async function getBountyTreasuryAccount(api, bountyIndex) {
  const address = getBountyTreasuryAddress(bountyIndex);
  const account = await api.query.system.account(address);
  return account.toJSON();
}

async function getBountyTreasuryAccounts(api) {
  const bounties = await api.query.bounties.bounties.entries();
  const bountyIndexes = bounties.map(([key]) => key.args[0].toNumber());
  const promises = bountyIndexes.map((index) =>
    getBountyTreasuryAccount(api, index),
  );
  return await Promise.all(promises);
}

async function getBountyTreasuryOnRelayChain() {
  return await multiApiQuery("polkadot", (api) =>
    getBountyTreasuryAccounts(api),
  );
}

module.exports = {
  getTreasuryDotOnRelayChain,
  getBountyTreasuryOnRelayChain,
};
