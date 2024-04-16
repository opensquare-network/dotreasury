require("dotenv").config();

const { createYoga } = require("graphql-yoga");
const { createServer } = require("http");
const { schema } = require("./schema");
const { createChainApis } = require("./apis");
const { updateChainsTreasuryBalance } = require("./jobs/treasury");
const { startGateTickerCronJob } = require("./jobs/ccxt/gate");
const { startKrakenTickerCronJob } = require("./jobs/ccxt/kraken");

const port = parseInt(process.env.PORT) || 5011;

function main() {
  createChainApis().then(async () => {
    console.log("Chain node apis initialized");
    updateChainsTreasuryBalance().catch(console.error);
    startGateTickerCronJob();
    startKrakenTickerCronJob();
  });

  const yoga = createYoga({ schema });
  const server = createServer(yoga);
  server.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`);
  });
}

main();
