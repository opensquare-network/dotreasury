const dotenv = require("dotenv");
dotenv.config();

const DB = require("./output-scan");
const { normalizeTokenValue } = require("../utils");
const BigNumber = require("bignumber.js");

const dotDbName = process.env.MONGO_DB_OUTPUT_DOT_NAME;
if (!dotDbName) {
  console.log("MONGO_DB_OUTPUT_DOT_NAME not set");
  process.exit(1);
}

const ksmDbName = process.env.MONGO_DB_OUTPUT_KSM_NAME;
if (!ksmDbName) {
  console.log("MONGO_DB_OUTPUT_KSM_NAME not set");
  process.exit(1);
}

const dbNames = {
  kusama: ksmDbName,
  polkadot: dotDbName,
};
const dbUrls = {
  kusama: process.env.KSM_MONGO_URL,
  polkadot: process.env.DOT_MONGO_URL,
}

function calcPriceByToken(tokenValue, symbolPrice) {
  return new BigNumber(tokenValue).multipliedBy(symbolPrice || 0).toFixed(5);
}

const { getPrice } = require("./price");

async function savePrice(chain, col) {
  const items = await col.find({}).toArray();

  for (const item of items) {
    if (item.symbolPrice !== undefined) {
      continue;
    }
    const blockTime = item.indexer?.blockTime;
    if (blockTime) {
      const price = await getPrice(chain, blockTime);
      if (price) {
        const tokenValue = normalizeTokenValue(item.value, chain)
        const allPrice = calcPriceByToken(tokenValue, price);

        await col.updateOne(
          { _id: item._id },
          {
            $set: {
              symbolPrice: price,
              fiatValue: parseFloat(allPrice),
            },
          }
        );
      }
    }
  }
}

async function main() {
  for (const chain of ["kusama", "polkadot"]) {
    const dbUrl = dbUrls[chain];
    const dbName = dbNames[chain];
    const {
      getTipCollection,
      getProposalCollection,
      getBountyCollection,
      getChildBountyCollection,
      getReferendaReferendumCollection,
    } = DB(dbUrl, dbName);

    const tipCol = await getTipCollection();
    await savePrice(chain, tipCol);

    const proposalCol = await getProposalCollection();
    await savePrice(chain, proposalCol);

    const bountyCol = await getBountyCollection();
    await savePrice(chain, bountyCol);

    const childBountyCol = await getChildBountyCollection();
    await savePrice(chain, childBountyCol);

    if (chain === "kusama") {
      const referendaCol = await getReferendaReferendumCollection();
      await savePrice(chain, referendaCol);
    }

    console.log("Update price successful:", dbName);
  }

  process.exit(0);
}

main().catch(console.error);
