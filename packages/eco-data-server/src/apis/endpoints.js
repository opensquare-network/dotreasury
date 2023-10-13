const CHAINS = Object.freeze({
  polkadot: "polkadot",
  kusama: "kusama",
  centrifuge: "centrifuge",
  khala: "khala",
  phala: "phal",
  basilisk: "basilisk",
  hydradx: "hydradx",
  interlay: "interlay",
  kintsugi: "kintsugi",
});

const endpoints = Object.freeze({
  polkadot: [
    "wss://rpc.polkadot.io",
    "wss://polkadot-rpc.dwellir.com",
  ],
  kusama: [
    "wss://kusama-rpc.polkadot.io",
    "wss://kusama-rpc.dwellir.com"
  ],
  centrifuge: [
    "wss://fullnode.centrifuge.io/",
    "wss://rpc-centrifuge.luckyfriday.io/",
  ],
  khala: [
    "wss://khala-api.phala.network/ws",
    "wss://khala-rpc.dwellir.com/",
  ],
  phala: [
    "wss://api.phala.network/ws",
    "wss://phala-rpc.dwellir.com/",
  ],
  hydradx: [
    "wss://hydradx-rpc.dwellir.com/",
    "wss://rpc.hydradx.cloud/"
  ],
  basilisk: [
    "wss://basilisk-rpc.dwellir.com/",
    "wss://rpc.basilisk.cloud/"
  ],
  interlay: [
    "wss://api.interlay.io/parachain",
    "wss://interlay-rpc.dwellir.com/"
  ],
  kintsugi: [
    "wss://kintsugi-rpc.dwellir.com/",
    "wss://api-kusama.interlay.io/parachain",
  ],
  moonriver: [
    "wss://wss.api.moonriver.moonbeam.network",
    "wss://moonriver-rpc.dwellir.com" ,
  ],
  moonbeam: [
    "wss://wss.api.moonbeam.network/",
    "wss://moonbeam-rpc.dwellir.com/",
  ],
});

module.exports = {
  endpoints,
  CHAINS,
}
