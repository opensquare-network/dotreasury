const endpoints = Object.freeze({
  polkadot: ["wss://rpc.polkadot.io", "wss://polkadot.ibp.network"],
  kusama: ["wss://kusama-rpc.polkadot.io", "wss://kusama.ibp.network"],
  hydradx: ["wss://rpc.hydradx.cloud", "wss://hydration.ibp.network"],
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
    "wss://asset-hub-polkadot.ibp.network",
  ],
  kusamaAssetHub: [
    "wss://kusama-asset-hub-rpc.polkadot.io",
    "wss://asset-hub-kusama.ibp.network",
  ],
  astar: ["wss://rpc.astar.network/"],
});

module.exports = {
  endpoints,
};
