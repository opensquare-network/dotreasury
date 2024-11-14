const pick = require("lodash.pick");
const {
  getSubsquareTreasuryProposalCollection,
} = require("../../mongo/polkadot");

async function fetchTreasuryProposalDetail(index) {
  console.log(`Fetching treasury proposal detail for index ${index}`);
  const resp = await fetch(
    `https://polkadot.subsquare.io/api/treasury/proposals/${index}`,
  );
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch treasury proposal detail for index ${index}: ${resp.statusText}`,
    );
  }
  return await resp.json();
}

async function fetchPagedTreasuryProposalsFromSubsquare(page) {
  console.log(`Fetching treasury proposals from subsquare page ${page}`);
  const resp = await fetch(
    `https://polkadot.subsquare.io/api/treasury/proposals?page=${page}`,
  );
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch treasury proposals from subsquare: ${resp.statusText}`,
    );
  }
  return await resp.json();
}

async function saveTreasuryProposal(detail) {
  const treasuryProposalCol = await getSubsquareTreasuryProposalCollection();
  await treasuryProposalCol.updateOne(
    { proposalIndex: detail.proposalIndex },
    {
      $set: {
        ...pick(detail, ["title"]),
        ...pick(detail.onchainData, [
          "indexer",
          "proposalIndex",
          "proposer",
          "value",
          "beneficiary",
          "meta",
          "state",
          "isFinal",
        ]),
      },
    },
    { upsert: true },
  );
}

async function syncTreasuryProposals() {
  let page = 1;

  do {
    const treasuryProposals = await fetchPagedTreasuryProposalsFromSubsquare(
      page,
    );

    const { items, total, pageSize } = treasuryProposals;

    await Promise.all(
      items.map(async ({ proposalIndex }) => {
        const detail = await fetchTreasuryProposalDetail(proposalIndex);
        await saveTreasuryProposal(detail);
      }),
    );

    if (total <= page * pageSize) {
      console.log("Finished syncing treasury proposals");
      break;
    }

    page++;
  } while (true);
}

module.exports = {
  syncTreasuryProposals,
};
