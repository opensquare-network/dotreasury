const endpoints = Object.freeze({
  polkadot: [
    "wss://rpc.polkadot.io",
    "wss://polkadot.api.onfinality.io/public-ws",
  ],
  kusama: [
    "wss://kusama-rpc.polkadot.io",
    "wss://kusama.api.onfinality.io/public-ws",
  ],
  hydradx: ["wss://rpc.hydradx.cloud", "wss://hydration-rpc.n.dwellir.com"],
  basilisk: ["wss://rpc.basilisk.cloud"],
  interlay: [
    "wss://api.interlay.io/parachain",
    "wss://rpc-interlay.luckyfriday.io",
  ],
  kintsugi: ["wss://api-kusama.interlay.io/parachain"],
  moonriver: ["wss://wss.api.moonriver.moonbeam.network"],
  moonbeam: ["wss://wss.api.moonbeam.network/"],
  acala: [
    "wss://acala-rpc-0.aca-api.network",
    "wss://acala-rpc-1.aca-api.network",
  ],
  karura: [
    "wss://karura-rpc-1.aca-api.network",
    "wss://karura-rpc-2.aca-api.network/ws",
  ],
  bifrostPolkadot: ["wss://eu.bifrost-polkadot-rpc.liebi.com/ws"],
  bifrostKusama: [
    "wss://bifrost-rpc.liebi.com/ws",
    "wss://us.bifrost-rpc.liebi.com/ws",
  ],
  polkadotAssetHub: [
    "wss://polkadot-asset-hub-rpc.polkadot.io",
    "wss://asset-hub-polkadot-rpc.n.dwellir.com",
    "wss://dot-rpc.stakeworld.io/assethub",
  ],
  kusamaAssetHub: [
    "wss://kusama-asset-hub-rpc.polkadot.io",
    "wss://asset-hub-kusama-rpc.n.dwellir.com",
    "wss://rpc-asset-hub-kusama.luckyfriday.io",
  ],
  astar: [
    "wss://rpc.astar.network/",
    "wss://astar.api.onfinality.io/public-ws",
  ],
});

module.exports = {
  endpoints,
};
