require("dotenv").config();

const { getTermsCollection, getRenouncementCollection, closeDb, } = require("../mongo");
const {
  mongo: {
    known: { saveKnownHeights, closeKnownClient }
  }
} = require("@osn/scan-common")

async function saveHeights() {
  const termsCol = await getTermsCollection();
  const terms = await termsCol.find({}).toArray();
  let heights = [];
  for (const record of terms) {
    heights.push(record.indexer.blockHeight);
  }
  const termHeights = [...new Set(heights)];
  await saveKnownHeights(termHeights);

  const renouncementCol = await getRenouncementCollection();
  const records = await renouncementCol.find({}).toArray();
  heights = [];
  for (const record of records) {
    heights.push(record.blockHeight);
  }
  const renounceHeights = [...new Set(heights)];
  await saveKnownHeights(renounceHeights);

  await closeDb();
  await closeKnownClient();
  console.log('heights saved');
}

(async () => {
  await saveHeights();
})();
