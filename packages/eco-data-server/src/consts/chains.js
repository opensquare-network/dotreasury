const CHAINS = Object.freeze({
  polkadot: "polkadot",
  kusama: "kusama",
  centrifuge: "centrifuge",
  phala: "phala",
  basilisk: "basilisk",
  hydradx: "hydradx",
  interlay: "interlay",
  kintsugi: "kintsugi",
  acala: "acala",
  karura: "karura",
  bifrost: "bifrost",
  darwinia: "darwinia",
  integritee: "integritee",
  moonbeam: "moonbeam",
  moonriver: "moonriver",
  astar: "astar",
});

const omitChains = ["polkadotAssetHub", "khala"];

module.exports = {
  CHAINS,
  omitChains,
};
