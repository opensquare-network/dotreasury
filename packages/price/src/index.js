const dotenv = require("dotenv");
dotenv.config();

const minimist = require("minimist");
const { loopQueryAndSave } = require("./tick");

async function main() {
  const args = minimist(process.argv.slice(2));

  if (!args.symbol) {
    console.log("Must specify symbol with argument --symbol=[DOT|KSM]");
    return;
  }

  if (!["DOT", "KSM"].includes(args.symbol)) {
    console.log(`Unknown symbol "${args.symbol}"`);
    return;
  }

  await loopQueryAndSave(args.symbol);
}

main().catch(console.error);
