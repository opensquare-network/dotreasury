const pick = require("lodash.pick");
const { getSubsquareTreasurySpendCollection } = require("../../mongo/polkadot");
const { getAssetByMeta } = require("./spendMeta");

async function fetchTreasurySpendDetail(index) {
  console.log(`Fetching spend detail for index ${index}`);
  const resp = await fetch(
    `https://polkadot.subsquare.io/api/treasury/spends/${index}`,
  );
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch spend detail for index ${index}: ${resp.statusText}`,
    );
  }
  return await resp.json();
}

async function fetchPagedSpendsFromSubsquare(page) {
  console.log(`Fetching spends from subsquare page ${page}`);
  const resp = await fetch(
    `https://polkadot.subsquare.io/api/treasury/spends?page=${page}`,
  );
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch spends from subsquare: ${resp.statusText}`,
    );
  }
  return await resp.json();
}

async function saveTreasurySpend(detail) {
  const spendCol = await getSubsquareTreasurySpendCollection();
  await spendCol.updateOne(
    { type: "treasurySpend", index: detail.index },
    {
      $set: {
        ...pick(detail, ["title"]),
        ...pick(detail.onchainData, [
          "indexer",
          "index",
          "proposer",
          "meta",
          "state",
          "isFinal",
          "isByGov2",
          "gov2Referendum",
          "track",
        ]),
        value: detail.onchainData?.meta?.amount,
        assetType: getAssetByMeta(detail.onchainData?.meta),
      },
    },
    { upsert: true },
  );
}

async function syncTreasurySpends() {
  let page = 1;

  do {
    const spendsData = await fetchPagedSpendsFromSubsquare(page);

    const { items, total, pageSize } = spendsData;

    await Promise.all(
      items.map(async ({ index }) => {
        const detail = await fetchTreasurySpendDetail(index);
        await saveTreasurySpend(detail);
      }),
    );

    if (total <= page * pageSize) {
      console.log("Finished syncing spends");
      break;
    }

    page++;
  } while (true);
}

module.exports = {
  syncTreasurySpends,
};
