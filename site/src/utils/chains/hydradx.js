const value = "hydration";

const endpoints = [
  {
    name: "Galactic Council",
    url: "wss://rpc.hydradx.cloud",
  },
  {
    name: "IBP1",
    url: "wss://hydration.ibp.network/",
  },
  {
    name: "Helikon",
    url: "wss://rpc.helikon.io/hydradx",
  },
  {
    name: "IBP2",
    url: "wss://hydration.dotters.network/",
  },
  {
    name: "Dwellir",
    url: "wss://hydration-rpc.n.dwellir.com/",
  },
];

export const hydradx = {
  value,
  name: "Hydration",
  symbol: "HDX",
  decimals: 12,
  hasSubscan: true,
  endpoints,
};
