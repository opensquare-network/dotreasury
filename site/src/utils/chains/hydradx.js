const value = "hydration";

const endpoints = [
  {
    name: "Galactic Council",
    url: "wss://rpc.hydradx.cloud",
  },
  {
    name: "Helikon",
    url: "wss://rpc.helikon.io/hydradx",
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
