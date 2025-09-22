const dotenv = require("dotenv");
dotenv.config();

const BigNumber = require("bignumber.js");
const {
  getStatusCollection,
  getIncomeInflationCollection,
} = require("../mongo/data");

async function main() {
  const inflationCol = await getIncomeInflationCollection();
  const inflations = await inflationCol.find({}).toArray();
  console.log(`Total ${inflations.length} inflation records found`);

  const totalInflation = inflations
    .reduce((sum, item) => sum.plus(item.balance || 0), new BigNumber(0))
    .toFixed();

  console.log(`Total inflation: ${totalInflation}`);

  const statusCol = await getStatusCollection();
  await statusCol.updateOne(
    { name: "income-scan" },
    {
      $set: {
        "seats.inflation": totalInflation,
      },
    },
  );
}

main()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
