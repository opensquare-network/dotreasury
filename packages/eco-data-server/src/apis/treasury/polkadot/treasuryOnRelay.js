const { multiApiQuery, getBountyTreasuryAddress } = require("./common");
const { USDT_ASSET_ID, USDC_ASSET_ID } = require("./consts");

const RelayChainTreasuryAccount =
  "13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB";

async function getTreasuryDotOnRelayChainFromApi(api) {
  const account = await api.query.system.account(RelayChainTreasuryAccount);
  return account.toJSON();
}

async function getTreasuryUsdxOnRelayChainFromApi(api, assetId) {
  const account = await api.query.assets.account(
    assetId,
    RelayChainTreasuryAccount,
  );
  return account.toJSON();
}

async function getTreasuryOnRelayChainFromApi(api) {
  const dotTreasuryBalanceOnRelayChain =
    await getTreasuryDotOnRelayChainFromApi(api);
  const usdtTreasuryBalanceOnRelayChain =
    await getTreasuryUsdxOnRelayChainFromApi(api, USDT_ASSET_ID);
  const usdcTreasuryBalanceOnRelayChain =
    await getTreasuryUsdxOnRelayChainFromApi(api, USDC_ASSET_ID);

  return {
    dotTreasuryBalanceOnRelayChain,
    usdtTreasuryBalanceOnRelayChain,
    usdcTreasuryBalanceOnRelayChain,
  };
}

async function getTreasuryOnRelayChain() {
  return await multiApiQuery("polkadotAssetHub", (api) =>
    getTreasuryOnRelayChainFromApi(api),
  );
}

async function getBountyTreasuryAccount(api, bountyIndex) {
  const address = getBountyTreasuryAddress(bountyIndex);
  const account = await api.query.system.account(address);
  return account.toJSON();
}

async function getBountyTreasuryOnRelayChainFromApi(api) {
  const bounties = await api.query.bounties.bounties.entries();
  const bountyIndexes = bounties.map(([key]) => key.args[0].toNumber());
  const promises = bountyIndexes.map((index) =>
    getBountyTreasuryAccount(api, index),
  );
  return await Promise.all(promises);
}

async function getBountyTreasuryOnRelayChain() {
  return await multiApiQuery("polkadotAssetHub", (api) =>
    getBountyTreasuryOnRelayChainFromApi(api),
  );
}

module.exports = {
  getTreasuryOnRelayChain,
  getTreasuryDotOnRelayChainFromApi,
  getBountyTreasuryOnRelayChain,
  getBountyTreasuryOnRelayChainFromApi,
};
