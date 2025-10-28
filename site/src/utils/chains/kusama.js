import { capitalizeFirstLetter } from "../../utils";

const value = "kusama";

const assetHubEndpoints = [
  { name: "Parity", url: "wss://kusama-asset-hub-rpc.polkadot.io" },
  { name: "IBP1", url: "wss://sys.ibp.network/asset-hub-kusama" },
  {
    name: "RadiumBlock",
    url: "wss://statemine.public.curie.radiumblock.co/ws",
  },
  { name: "Dwellir", url: "wss://asset-hub-kusama-rpc.dwellir.com" },
  { name: "Dwellir Tunisia", url: "wss://statemine-rpc-tn.dwellir.com" },
  { name: "IBP2", url: "wss://asset-hub-kusama.dotters.network/" },
  { name: "LuckyFriday", url: "wss://rpc-asset-hub-kusama.luckyfriday.io" },
  { name: "Stakeworld", url: "wss://ksm-rpc.stakeworld.io/assethub" },
];

export const kusama = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "KSM",
  decimals: 12,
  ss58Format: 2,
  blockTime: 6000,
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

  ui: {
    totalStacked: {
      yStepSize: 200000,
    },
  },

  api: {
    scanServer: "https://kusama-api.dotreasury.com",
    socketIOUrl: "kusama-api.dotreasury.com",
    subsquareApi: "https://kusama-api.subsquare.io",
  },
  assetHubEndpoints,
  assethubMigration: {
    migrated: true,
    timestamp: 1759844124000,
  },
  usersMigration: true,
};
