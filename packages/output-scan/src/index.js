require("dotenv").config();
const { checkSpecs } = require("./chain/specs/check");
const { updateSpecs } = require("./chain/specs");
const { updateHeight } = require("./chain/latestHead");
const { disconnect } = require("./api");

async function main() {
  await updateHeight();
  await updateSpecs();
  checkSpecs();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
