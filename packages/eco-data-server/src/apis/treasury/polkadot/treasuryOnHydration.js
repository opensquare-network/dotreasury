const { multiApiQuery } = require("./common");

const DotTokenId = 5;
const UsdtTokenIdFromAssetHub = 10;
const UsdcTokenIdFromAssetHub = 22;

const PolkadotTreasuryOnHydrationAccount1 =
  "7LcF8b5GSvajXkSChhoMFcGDxF9Yn9unRDceZj1Q6NYox8HY";

const PolkadotTreasuryOnHydrationAccount2 =
  "7KCp4eenFS4CowF9SpQE5BBCj5MtoBA3K811tNyRmhLfH1aV";

const PolkadotTreasuryOnHydrationAccount3 =
  "7KATdGaecnKi4zDAMWQxpB2s59N2RE1JgLuugCjTsRZHgP24";

async function getHydrationTreasuryBalance(api, treasuryAccount, tokenId) {
  const account = await api.query.tokens.accounts(treasuryAccount, tokenId);
  return account.toJSON();
}

async function getHydrationTreasuryBalances(api, treasuryAccount) {
  const [accountUsdt, accountUsdc, accountDot] = await Promise.all([
    getHydrationTreasuryBalance(api, treasuryAccount, UsdtTokenIdFromAssetHub),
    getHydrationTreasuryBalance(api, treasuryAccount, UsdcTokenIdFromAssetHub),
    getHydrationTreasuryBalance(api, treasuryAccount, DotTokenId),
  ]);

  return {
    accountUsdt,
    accountUsdc,
    accountDot,
  };
}

async function getTreasuryOnHydration() {
  const hydrationTreasuryAccount1 = await multiApiQuery("hydradx", (api) =>
    getHydrationTreasuryBalances(api, PolkadotTreasuryOnHydrationAccount1),
  );
  const hydrationTreasuryAccount2 = await multiApiQuery("hydradx", (api) =>
    getHydrationTreasuryBalances(api, PolkadotTreasuryOnHydrationAccount2),
  );
  const hydrationTreasuryAccount3 = await multiApiQuery("hydradx", (api) =>
    getHydrationTreasuryBalances(api, PolkadotTreasuryOnHydrationAccount3),
  );

  return {
    hydrationTreasuryAccount1,
    hydrationTreasuryAccount2,
    hydrationTreasuryAccount3,
  };
}

module.exports = {
  getTreasuryOnHydration,
};
