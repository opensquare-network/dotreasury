import { capitalizeFirstLetter } from "../../utils";

const value = "polkadot";

const assetHubEndpoints = [
  {
    name: "OnFinality",
    url: "wss://statemint.api.onfinality.io/public-ws",
  },
  {
    name: "Parity",
    url: "wss://polkadot-asset-hub-rpc.polkadot.io",
  },
  {
    name: "IBP1",
    url: "wss://sys.ibp.network/asset-hub-polkadot",
  },
  {
    name: "IBP2",
    url: "wss://asset-hub-polkadot.dotters.network",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-asset-hub-polkadot.luckyfriday.io",
  },
  {
    name: "Dwellir",
    url: "wss://asset-hub-polkadot-rpc.dwellir.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://statemint-rpc-tn.dwellir.com",
  },
  {
    name: "RadiumBlock",
    url: "wss://statemint.public.curie.radiumblock.co/ws",
  },
  {
    name: "Stakeworld",
    url: "wss://dot-rpc.stakeworld.io/assethub",
  },
];

export const polkadot = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "DOT",
  decimals: 10,
  ss58Format: 0,
  supportOpenGov: true,
  hasDotreasury: true,
  hasSubscan: true,
  hasStatescan: true,

  hasProjects: true,
  hasOutputPeriods: true,

  hasStaking: true,
  hasSpends: true,
  hasTips: true,
  hasBounties: true,
  hasTransfers: true,
  hasBurnt: true,

  hasAssetHub: true,

  api: {
    scanServer: "https://polkadot-api.dotreasury.com",
    socketIOUrl: "https://polkadot-api.dotreasury.com",
  },
  assetHubEndpoints,
};
