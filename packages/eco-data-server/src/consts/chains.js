const CHAINS = Object.freeze({
  polkadot: "polkadot",
  kusama: "kusama",
  centrifuge: "centrifuge",
  basilisk: "basilisk",
  hydradx: "hydradx",
  interlay: "interlay",
  kintsugi: "kintsugi",
  acala: "acala",
  karura: "karura",
  bifrost: "bifrost",
  moonbeam: "moonbeam",
  moonriver: "moonriver",
  astar: "astar",
});

const omitChains = ["polkadotAssetHub", "khala"];

module.exports = {
  CHAINS,
  omitChains,
};
