const dotenv = require("dotenv");
dotenv.config();

const chunk = require("lodash.chunk");
const negate = require("lodash.negate");
const isNil = require("lodash.isnil");
const {
  getProposalCollection,
  getReferendaReferendumCollection,
} = require("../mongo");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchTitle(apiUrl) {
  try {
    const resp = await fetch(apiUrl);
    if (!resp.ok) {
      return;
    }

    const data = await resp.json();
    return data?.title;
  } catch (e) {
    return;
  }
}

async function syncTitle({ col, fetchTitle, updateTitle }) {
  const allItems = await col.find({}).toArray();

  // Process in batches that 10 items for each
  for (const items of chunk(allItems, 10)) {
    // Fetch titles from subsquare.io
    const titles = await Promise.all(items.map((item) => fetchTitle(item)));

    // Make sure has titles
    if (titles.filter(negate(isNil)).length === 0) {
      continue;
    }

    const bulk = col.initializeUnorderedBulkOp();
    for (let i = 0; i < items.length; i++) {
      // Skip nil
      if (isNil(titles[i])) {
        continue;
      }
      // Skip Untitled
      if (titles[i] === "Untitled") {
        continue;
      }

      updateTitle(bulk, items[i], titles[i]);
    }
    await bulk.execute();
  }
}

function fetchGov2ReferendaTitle(referendumIndex) {
  return fetchTitle(
    `https://${process.env.CHAIN}.subsquare.io/api/gov2/referendums/${referendumIndex}`,
  );
}

async function syncGov2ReferendaTitle() {
  console.log(`Sync OpenGov referenda title`);
  await syncTitle({
    col: await getReferendaReferendumCollection(),
    fetchTitle: (item) => fetchGov2ReferendaTitle(item.referendumIndex),
    updateTitle: (bulk, item, title) =>
      bulk.find({ referendumIndex: item.referendumIndex }).updateOne({
        $set: { description: title },
      }),
  });
}

function fetchProposalTitle(proposalIndex) {
  return fetchTitle(
    `https://${process.env.CHAIN}.subsquare.io/api/treasury/proposals/${proposalIndex}`,
  );
}

async function syncProposalTitle() {
  console.log(`Sync treasury proposal title`);
  await syncTitle({
    col: await getProposalCollection(),
    fetchTitle: (item) => fetchProposalTitle(item.proposalIndex),
    updateTitle: (bulk, item, title) =>
      bulk.find({ proposalIndex: item.proposalIndex }).updateOne({
        $set: { description: title },
      }),
  });
}

module.exports = {
  syncGov2ReferendaTitle,
  syncProposalTitle,
};
