const endpoints = Object.freeze({
  polkadot: [
    "wss://rpc.polkadot.io",
    "wss://polkadot-rpc.dwellir.com",
    "wss://polkadot.api.onfinality.io/public-ws",
  ],
  kusama: [
    "wss://kusama-rpc.polkadot.io",
    "wss://kusama.api.onfinality.io/public-ws",
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
});

module.exports = {
  endpoints,
}
