const endpoints = Object.freeze({
  polkadot: ["wss://rpc.polkadot.io", "wss://polkadot-rpc.dwellir.com"],
  kusama: ["wss://kusama-rpc.polkadot.io", "wss://kusama-rpc.dwellir.com"],
  centrifuge: [
    "wss://fullnode.centrifuge.io/",
    "wss://rpc-centrifuge.luckyfriday.io/",
  ],
  phala: [
    "wss://phala.api.onfinality.io/public-ws",
    "wss://phala-rpc.dwellir.com/",
  ],
  hydradx: ["wss://hydradx-rpc.dwellir.com/", "wss://rpc.hydradx.cloud/"],
  basilisk: ["wss://basilisk-rpc.dwellir.com/", "wss://rpc.basilisk.cloud/"],
  interlay: [
    "wss://api.interlay.io/parachain",
    "wss://interlay-rpc.dwellir.com/",
  ],
  kintsugi: [
    "wss://kintsugi-rpc.dwellir.com/",
    "wss://api-kusama.interlay.io/parachain",
  ],
  moonriver: [
    "wss://wss.api.moonriver.moonbeam.network",
    "wss://moonriver-rpc.dwellir.com",
  ],
  moonbeam: [
    "wss://wss.api.moonbeam.network/",
    "wss://moonbeam-rpc.dwellir.com/",
  ],
  acala: [
    "wss://acala-rpc-0.aca-api.network",
    "wss://acala-rpc-1.aca-api.network",
  ],
  karura: [
    "wss://karura-rpc-1.aca-api.network",
    "wss://karura-rpc-2.aca-api.network/ws",
  ],
  bifrostPolkadot: [
    "wss://hk.p.bifrost-rpc.liebi.com/ws",
    "wss://eu.bifrost-polkadot-rpc.liebi.com/ws",
  ],
  bifrostKusama: [
    "wss://bifrost-rpc.dwellir.com",
    "wss://bifrost-rpc.liebi.com/ws",
  ],
  darwinia: [
    "wss://rpc.darwinia.network",
    "wss://darwinia.rpc.subquery.network/public/ws",
  ],
  integritee: [
    "wss://kusama.api.integritee.network/",
    "wss://integritee-kusama.api.onfinality.io/public-ws",
  ],
  mythos: ["wss://polkadot-mythos-rpc.polkadot.io"],
  polkadotAssetHub: [
    "wss://dot-rpc.stakeworld.io/assethub",
    "wss://statemint.public.curie.radiumblock.co/ws",
  ],
  astar: ["wss://rpc.astar.network/", "wss://astar-rpc.dwellir.com/"],
});

module.exports = {
  endpoints,
};
