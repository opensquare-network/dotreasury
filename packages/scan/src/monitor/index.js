const dotenv = require("dotenv");
const pm2 = require("pm2");

dotenv.config();

const { getStatusCollection } = require("../mongo");

pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  console.log('Connect pm2 successful.');
});

console.log(process.argv);
const pm2JobName = process.argv[2];
if (pm2JobName) {
  console.log(`Monitoring pm2 job activities: ${pm2JobName}`);
} else {
  console.log('Please run with:');
  console.log('node src/monitor the-pm2-job-name');
  process.exit();
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
  const statusCol = await getStatusCollection();
  let prevSeenBlockHeight = await statusCol.findOne({ name: "main-scan-height" });
  if (!prevSeenBlockHeight) {
    console.error('The scanning height is not loaded!');
    process.exit(1);
  }

  console.log('Initial scanning height:', prevSeenBlockHeight.value)

  while (true) {
    await sleep(60*1000);

    const currentBlockHeight = await statusCol.findOne({ name: "main-scan-height" });
    if (currentBlockHeight.value === prevSeenBlockHeight.value) {
      console.log(`The scanning height is stucking at ${prevSeenBlockHeight.value}`);
      console.log(`Trying to restart ${pm2JobName}...`);
      pm2.restart(pm2JobName, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    prevSeenBlockHeight = currentBlockHeight;
  }
};

main();
