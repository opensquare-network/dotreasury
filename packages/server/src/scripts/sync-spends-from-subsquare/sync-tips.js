const pick = require("lodash.pick");
const { getSubsquareTipCollection } = require("../../mongo/polkadot");

async function fetchTipDetail(hash) {
  console.log(`Fetching tip detail for hash ${hash}`);
  const resp = await fetch(
    `https://polkadot.subsquare.io/api/treasury/tips/${hash}`,
  );
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch tip detail for hash ${hash}: ${resp.statusText}`,
    );
  }
  return await resp.json();
}

async function fetchPagedTipsFromSubsquare(page) {
  console.log(`Fetching tips from subsquare page ${page}`);
  const resp = await fetch(
    `https://polkadot.subsquare.io/api/treasury/tips?page=${page}`,
  );
  if (!resp.ok) {
    throw new Error(`Failed to fetch tips from subsquare: ${resp.statusText}`);
  }
  return await resp.json();
}

async function saveTip(detail) {
  const tipCol = await getSubsquareTipCollection();
  await tipCol.updateOne(
    { hash: detail.hash },
    {
      $set: {
        ...pick(detail, ["title"]),
        ...pick(detail.onchainData, [
          "indexer",
          "hash",
          "finder",
          "meta",
          "tipFindersFee",
          "medianValue",
          "state",
          "isFinal",
        ]),
      },
    },
    { upsert: true },
  );
}

async function syncTips() {
  let page = 1;

  do {
    const treasuryProposals = await fetchPagedTipsFromSubsquare(page);

    const { items, total, pageSize } = treasuryProposals;

    await Promise.all(
      items.map(async ({ hash }) => {
        const detail = await fetchTipDetail(hash);
        await saveTip(detail);
      }),
    );

    if (total <= page * pageSize) {
      console.log("Finished syncing tips");
      break;
    }

    page++;
  } while (true);
}

module.exports = {
  syncTips,
};
