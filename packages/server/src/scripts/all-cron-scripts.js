const dotenv = require("dotenv");
dotenv.config();

const migrateLinks = require("./migrate-links");
const pinRateToIpfs = require("./pin-rate-to-ipfs");
const updateSort = require("./update-sort");
const { updateParticipants } = require("./update-participants");
const { syncGov2ReferendaTitle } = require("./sync-proposal-title");

async function main() {
  try {
    await migrateLinks();
  } catch (e) {
    console.error(e.message);
  }

  try {
    await updateSort();
  } catch (e) {
    console.error(e.message);
  }

  try {
    await updateParticipants();
  } catch (e) {
    console.error(e.message);
  }

  try {
    await pinRateToIpfs();
  } catch (e) {
    console.error(e.message);
  }

  try {
    await syncGov2ReferendaTitle();
  } catch (e) {
    console.error(e.message);
  }
}

main().then(() => process.exit(0));
