const dotenv = require("dotenv");
dotenv.config();

const chunk = require("lodash.chunk");
const negate = require("lodash.negate");
const isNil = require("lodash.isnil");
const { getReferendaReferendumCollection } = require("../mongo");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

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

async function syncTitle({ col, titleFetcher, titleUpdater }) {
  const allItems = await col.find({}).toArray();

  // Process in batches that 10 items for each
  for (const items of chunk(allItems, 10)) {
    // Fetch titles from subsquare.io
    const titles = await Promise.all(
      items.map(item => titleFetcher(item))
    );

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

      titleUpdater(bulk, items[i], titles[i]);
    }
    await bulk.execute();
  }
}

const fetchGov2ReferendaTitle = (chain, referendumIndex) =>
  fetchTitle(`https://${chain}.subsquare.io/api/gov2/referendums/${referendumIndex}`);

async function syncGov2ReferendaTitle(chain) {
  await syncTitle({
    col: await getReferendaReferendumCollection(chain),
    titleFetcher: (item) => fetchGov2ReferendaTitle(chain, item.referendumIndex),
    titleUpdater: (bulk, item, title) =>
      bulk
        .find({ referendumIndex: item.referendumIndex })
        .updateOne({
          $set: { description: title }
        })
  });
}

async function main() {
  console.log(`Sync OpenGov referenda title`);
  await syncGov2ReferendaTitle("kusama");
}

module.exports = main;
