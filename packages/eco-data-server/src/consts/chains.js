const CHAINS = Object.freeze({
  polkadot: "polkadot",
  kusama: "kusama",
  hydradx: "hydradx",
  acala: "acala",
  karura: "karura",
  bifrost: "bifrost",
  astar: "astar",
});

const omitChains = ["polkadotAssetHub", "khala"];

module.exports = {
  CHAINS,
  omitChains,
};
