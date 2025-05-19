const { multiApiQuery } = require("./common");

const MYTHOS_PARACHAIN_ID = 3369;
const MythTokenAccount = "13gYFscwJFJFqFMNnttzuTtMrApUEmcUARtgFubbChU9g6mh";

async function getMythTreasuryOnMythosFromApi(api) {
  const account = await api.query.foreignAssets.account(
    {
      parents: 1,
      interior: {
        X1: [
          {
            Parachain: MYTHOS_PARACHAIN_ID,
          },
        ],
      },
    },
    MythTokenAccount,
  );
  return account.toJSON();
}

async function getMythTreasuryOnMythos() {
  return await multiApiQuery("polkadotAssetHub", (api) =>
    getMythTreasuryOnMythosFromApi(api),
  );
}

module.exports = {
  getMythTreasuryOnMythos,
  getMythTreasuryOnMythosFromApi,
};
