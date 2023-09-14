// todo: 1. set chains and related endpoints
// todo: 2. decide database collections to save treasury and price data
// todo: 3. add scripts to read treasury balance and save it to database
// todo: 4. add graphql server to serve related data to fronted

require("dotenv").config();

const { createYoga } = require("graphql-yoga");
const { createServer } = require("http");
const { schema } = require("./schema");
const { createChainApis } = require("./apis");
const { updateTreasuryBalance } = require("./jobs/treasury");

const port = parseInt(process.env.PORT) || 5011;

function main() {
  createChainApis().then(async () => {
    console.log("Chain node apis initialized")
    await updateTreasuryBalance();
  });

  const yoga = createYoga({ schema });
  const server = createServer(yoga);
  server.listen(port, () => {
    console.info(`Server is running on http://localhost:${ port }/graphql`);
  });
}

main();
