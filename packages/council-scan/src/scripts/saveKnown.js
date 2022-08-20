require("dotenv").config();

const { getTermsCollection, getRenouncementCollection, } = require("../mongo");
const { saveKnownHeights, closeKnownClient, } = require("../mongo/knownHeight");

async function saveHeights() {
  const termsCol = await getTermsCollection();
  const terms = await termsCol.find({});
  let heights = [];
  for (const record of terms) {
    heights.push(record.indexer.blockHeight);
  }
  const termHeights = [...new Set(heights)];
  await saveKnownHeights(termHeights);

  const renouncementCol = await getRenouncementCollection();
  const records = await renouncementCol.find({});
  heights = [];
  for (const record of records) {
    heights.push(record.blockHeight);
  }
  const renounceHeights = [...new Set(heights)];
  await saveKnownHeights(renounceHeights);

  await closeKnownClient();
}

(async () => {
  await saveHeights();
})();
