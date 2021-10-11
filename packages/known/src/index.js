require("dotenv").config();
const { closeKnownClient } = require("./mongo/knownHeight");
const { closeDataDbClient } = require("./mongo/data");
const { saveKnownHeights } = require("./mongo/service/known");
const { getProposalHeights } = require("./heights/proposal");

async function main() {
  const proposalHeights = await getProposalHeights();
  await saveKnownHeights(proposalHeights);
}

main()
  .then(async () => {
    console.log("Known heights saved")
    await closeDataDbClient();
    await closeKnownClient();
  })
  .catch(console.error)
