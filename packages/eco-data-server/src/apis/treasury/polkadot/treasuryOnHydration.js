const { multiApiQuery } = require("./common");

const DotTokenId = 5;
const ADotTokenId = 1001;
const UsdtTokenIdFromAssetHub = 10;
const UsdcTokenIdFromAssetHub = 22;

const PolkadotTreasuryOnHydrationAccount1 =
  "7LcF8b5GSvajXkSChhoMFcGDxF9Yn9unRDceZj1Q6NYox8HY";

const PolkadotTreasuryOnHydrationAccount2 =
  "7KCp4eenFS4CowF9SpQE5BBCj5MtoBA3K811tNyRmhLfH1aV";

const PolkadotTreasuryOnHydrationAccount3 =
  "7KATdGaecnKi4zDAMWQxpB2s59N2RE1JgLuugCjTsRZHgP24";

const PolkadotTreasuryOnHydrationAccount4 =
  "7N4oFqXKgeTXo6CMSY9BVZdHP5J3RhQXY77Fe7qmQwjcxa1w";

async function getHydrationTreasuryBalance(api, treasuryAccount, tokenId) {
  const account = await api.query.tokens.accounts(treasuryAccount, tokenId);
  return account.toJSON();
}

async function getHydrationTreasuryBalances(api, treasuryAccount) {
  const [accountUsdt, accountUsdc, accountDot, accountADot] = await Promise.all(
    [
      getHydrationTreasuryBalance(
        api,
        treasuryAccount,
        UsdtTokenIdFromAssetHub,
      ),
      getHydrationTreasuryBalance(
        api,
        treasuryAccount,
        UsdcTokenIdFromAssetHub,
      ),
      getHydrationTreasuryBalance(api, treasuryAccount, DotTokenId),
      getHydrationTreasuryBalance(api, treasuryAccount, ADotTokenId),
    ],
  );

  return {
    accountUsdt,
    accountUsdc,
    accountDot,
    accountADot,
  };
}

async function getTreasuryOnHydrationFromApi(api) {
  const hydrationTreasuryAccount1 = await getHydrationTreasuryBalances(
    api,
    PolkadotTreasuryOnHydrationAccount1,
  );
  const hydrationTreasuryAccount2 = await getHydrationTreasuryBalances(
    api,
    PolkadotTreasuryOnHydrationAccount2,
  );
  const hydrationTreasuryAccount3 = await getHydrationTreasuryBalances(
    api,
    PolkadotTreasuryOnHydrationAccount3,
  );
  const hydrationTreasuryAccount4 = await getHydrationTreasuryBalances(
    api,
    PolkadotTreasuryOnHydrationAccount4,
  );

  return {
    hydrationTreasuryAccount1,
    hydrationTreasuryAccount2,
    hydrationTreasuryAccount3,
    hydrationTreasuryAccount4,
  };
}

async function getTreasuryOnHydration() {
  return await multiApiQuery("hydradx", (api) =>
    getTreasuryOnHydrationFromApi(api),
  );
}

module.exports = {
  getTreasuryOnHydration,
  getTreasuryOnHydrationFromApi,
};
