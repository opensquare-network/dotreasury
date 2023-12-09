require("dotenv").config();

const { createYoga } = require("graphql-yoga");
const { createServer } = require("http");
const { schema } = require("./schema");
const { createChainApis } = require("./apis");
const { updateChainsTreasuryBalance } = require("./jobs/treasury");
const { updateTokensPrice } = require("./jobs/price");

const port = parseInt(process.env.PORT) || 5011;

function main() {
  createChainApis().then(async () => {
    console.log("Chain node apis initialized");
    updateChainsTreasuryBalance().catch(console.error);
    updateTokensPrice().catch(console.error);
  });

  const yoga = createYoga({ schema });
  const server = createServer(yoga);
  server.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`);
  });
}

main();
