const { multiApiQuery } = require("./common");

const MYTHOS_PARACHAIN_ID = 3369;
const MythTokenAccount = "13gYFscwJFJFqFMNnttzuTtMrApUEmcUARtgFubbChU9g6mh";

async function getMythTreasuryAccount(api) {
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
    getMythTreasuryAccount(api),
  );
}

module.exports = {
  getMythTreasuryOnMythos,
};
