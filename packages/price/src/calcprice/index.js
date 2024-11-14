const dotenv = require("dotenv");
dotenv.config();

const DB = require("./output-scan");
const { normalizeTokenValue } = require("../utils");
const BigNumber = require("bignumber.js");
const { savePeriodPrice } = require("./period");

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

const cfgDbName = process.env.MONGO_DB_OUTPUT_CFG_NAME;
if (!cfgDbName) {
  console.log("MONGO_DB_OUTPUT_CFG_NAME not set");
  process.exit(1);
}

const dbNames = {
  kusama: ksmDbName,
  polkadot: dotDbName,
  centrifuge: cfgDbName,
};

const dbUrls = {
  kusama: process.env.KSM_MONGO_URL,
  polkadot: process.env.DOT_MONGO_URL,
  centrifuge: process.env.CFG_MONGO_URL,
};

function calcPriceByToken(tokenValue, symbolPrice) {
  return new BigNumber(tokenValue).multipliedBy(symbolPrice || 0).toFixed(5);
}

const { getPrice } = require("./price");

async function savePriceToItem(chain, col, item) {
  if (item.symbolPrice !== undefined) {
    return;
  }

  const blockTime = item.indexer?.blockTime;
  if (!blockTime) {
    return;
  }

  const price = await getPrice(chain, blockTime);
  if (!price) {
    return;
  }

  const tokenValue = normalizeTokenValue(item.value, chain);
  const allPrice = calcPriceByToken(tokenValue, price);

  await col.updateOne(
    { _id: item._id },
    {
      $set: {
        symbolPrice: price,
        fiatValue: parseFloat(allPrice),
      },
    },
  );
}

async function savePrice(chain, col) {
  const items = await col.find({}).toArray();
  for (const item of items) {
    await savePriceToItem(chain, col, item);
  }
}

async function main() {
  for (const chain of ["kusama", "polkadot", "centrifuge"]) {
    const dbUrl = dbUrls[chain];
    const dbName = dbNames[chain];
    const {
      getTipCollection,
      getProposalCollection,
      getBountyCollection,
      getChildBountyCollection,
      getReferendaReferendumCollection,
      getPeriodCol,
      getSubsquareTreasurySpendCollection,
    } = DB(dbUrl, dbName);

    const tipCol = await getTipCollection();
    await savePrice(chain, tipCol);

    const proposalCol = await getProposalCollection();
    await savePrice(chain, proposalCol);

    const bountyCol = await getBountyCollection();
    await savePrice(chain, bountyCol);

    const childBountyCol = await getChildBountyCollection();
    await savePrice(chain, childBountyCol);

    const periodCol = await getPeriodCol();
    await savePeriodPrice(chain, periodCol);

    if (["kusama", "polkadot"].includes(chain)) {
      const referendaCol = await getReferendaReferendumCollection();
      await savePrice(chain, referendaCol);
    }

    if (chain === "polkadot") {
      const subsquareTreasurySpendCol =
        await getSubsquareTreasurySpendCollection();

      const items = await subsquareTreasurySpendCol
        .find({
          $or: [
            { type: { $in: ["treasuryProposal", "tip"] } },
            { type: "treasurySpend", "assetType.type": "native" },
          ],
        })
        .toArray();

      console.log("save price to subsquare treasury spends", items.length);
      for (const item of items) {
        await savePriceToItem(chain, subsquareTreasurySpendCol, item);
      }

      const usdItems = await subsquareTreasurySpendCol
        .find({
          type: "treasurySpend",
          "assetType.symbol": { $in: ["USDt", "USDC"] },
        })
        .toArray();
      for (const item of usdItems) {
        await subsquareTreasurySpendCol.updateOne(
          { _id: item._id },
          {
            $set: {
              symbolPrice: 1,
              fiatValue: new BigNumber(item.value)
                .div(Math.pow(10, 6))
                .toNumber(),
            },
          },
        );
      }
    }

    console.log("Update price successful:", dbName);
  }

  process.exit(0);
}

main().catch(console.error);
