const { multiApiQuery } = require("./common");

const DotTokenId = 5;
const ADotTokenId = 1001;
const UsdtTokenIdFromAssetHub = 10;
const UsdcTokenIdFromAssetHub = 22;

const CURRENCIES_API_METHOD = "CurrenciesApi_account";
const RUNTIME_API_TYPE = "PalletCurrenciesRpcRuntimeApiAccountData";

const PolkadotTreasuryOnHydrationAccount1 =
  "7LcF8b5GSvajXkSChhoMFcGDxF9Yn9unRDceZj1Q6NYox8HY";

const PolkadotTreasuryOnHydrationAccount2 =
  "7KCp4eenFS4CowF9SpQE5BBCj5MtoBA3K811tNyRmhLfH1aV";

const PolkadotTreasuryOnHydrationAccount4 =
  "7N4oFqXKgeTXo6CMSY9BVZdHP5J3RhQXY77Fe7qmQwjcxa1w";

async function getADotBalanceByRuntimeApi(api, address) {
  try {
    const assetId = api.registry.createType("u32", ADotTokenId);
    const accountId = api.registry.createType("AccountId", address);
    const callParams = new Uint8Array([
      ...assetId.toU8a(),
      ...accountId.toU8a(),
    ]);

    const resultRaw = await api.rpc.state.call(
      CURRENCIES_API_METHOD,
      Array.from(callParams),
    );

    const accountData = api.registry.createType(RUNTIME_API_TYPE, resultRaw);
    return {
      free: BigInt(accountData?.free || 0n).toString(),
      reserved: BigInt(accountData?.reserved || 0n).toString(),
    };
  } catch (error) {
    console.error(
      `Error fetching aDot balance via Runtime API for ${address}:`,
    );
    return null;
  }
}

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

      getADotBalanceByRuntimeApi(api, treasuryAccount),
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
  const hydrationTreasuryAccount4 = await getHydrationTreasuryBalances(
    api,
    PolkadotTreasuryOnHydrationAccount4,
  );

  return {
    hydrationTreasuryAccount1,
    hydrationTreasuryAccount2,
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
