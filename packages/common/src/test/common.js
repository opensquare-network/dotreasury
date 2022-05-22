const { getProvider } = require("../chain/api");

async function disconnect() {
  const provider = getProvider();
  await provider.disconnect();
}

module.exports = {
  disconnect,
};
