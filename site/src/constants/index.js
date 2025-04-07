import { USDC } from "../utils/chains/usdc";
import { USDt } from "../utils/chains/usdt";
import { MYTH } from "./foreignAssets";

export const TipStatus = {
  Tipping: "Tipping",
  Closing: "Closing",
  Closed: "Closed",
  Retracted: "Retracted",
};

export const tipStatusMap = {
  NewTip: "Tipping",
  tip: "Tipping",
  TipRetracted: "Retracted",
  TipClosed: "Closed",
  TipSlashed: "Slashed",
  Removed: "Removed",
};

export const bountyStatusMap = {
  Proposed: "Proposed",
  Approved: "Approved",
  Funded: "Funded",
  CuratorProposed: "CuratorProposed",
  Active: "Active",
  PendingPayout: "PendingPayout",
  Rejected: "Rejected",
  Canceled: "Canceled",
  Claimed: "Claimed",
};

export const childBountyStatusMap = {
  Added: "Added",
  CuratorProposed: "CuratorProposed",
  Active: "Active",
  PendingPayout: "PendingPayout",
  Rejected: "Rejected",
  Canceled: "Canceled",
  Claimed: "Claimed",
};

export const proposalStatusMap = {
  Proposed: "Proposed",
  Approved: "Approved",
  Rejected: "Rejected",
  ApproveVoting: "ApproveVoting",
  RejectVoting: "RejectVoting",
  Awarded: "Awarded",
};

export const gov2ProposalStatusMap = {
  Approved: "Approved",
  Awarded: "Awarded",
};

export const openGovReferendumStatusMap = {
  Confirming: "Confirming",
  Deciding: "Deciding",
  Queueing: "Queueing",
  Submitted: "Submitted",
  Approved: "Approved",
  Cancelled: "Cancelled",
  Killed: "Killed",
  TimedOut: "TimedOut",
  Rejected: "Rejected",
  Executed: "Executed",
};

export const treasuryTipStatusMap = {
  NewTip: "NewTip",
  Tipping: "Tipping",
  TipClosed: "TipClosed",
  TipRetracted: "TipRetracted",
  TipSlashed: "TipSlashed",
};

export const treasuryProposalStatusMap = {
  ApproveVoting: "ApproveVoting",
  RejectVoting: "RejectVoting",
  Proposed: "Proposed",
  Approved: "Approved",
  Awarded: "Awarded",
  Rejected: "Rejected",
  Removed: "Removed",
};

export const treasurySpendStatusMap = {
  Approved: "Approved",
  Paid: "Paid",
  Processed: "Processed",
  Voided: "Voided",
};

export const polkadotTreasurySpendsAssetsFilterOptions = [
  { key: "all", value: "-1", text: "All assets" },
  { key: "native", value: "native", text: "DOT", asset: "native" },
  { key: "usdc", value: "usdc", text: USDC.name, asset: USDC.symbol },
  { key: "usdt", value: "usdt", text: USDt.name, asset: USDt.symbol },
  { key: "myth", value: "myth", text: MYTH.name, asset: MYTH.symbol },
];

export const kusamaTreasurySpendsAssetsFilterOptions = [
  { key: "all", value: "-1", text: "All assets" },
  { key: "native", value: "native", text: "KSM", asset: "native" },
];

export const TreasuryAccount =
  "F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29";

export const REACTION_THUMBUP = 1;
export const REACTION_THUMBDOWN = 2;

export const DEFAULT_KUSAMA_NODES = [
  {
    name: "IBP1",
    url: "wss://rpc.ibp.network/kusama",
  },
  {
    name: "OnFinality",
    url: "wss://kusama.api.onfinality.io/public-ws",
  },
  {
    name: "Parity",
    url: "wss://kusama-rpc.polkadot.io",
  },
  {
    name: "SubQuery",
    url: "wss://kusama.rpc.subquery.network/public/ws",
  },
  {
    name: "Helixstreet",
    url: "wss://rpc-kusama.helixstreet.io",
  },
  {
    name: "Dwellir",
    url: "wss://kusama-rpc.dwellir.com",
  },
  {
    name: "Allnodes",
    url: "wss://kusama-rpc.publicnode.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://kusama-rpc-tn.dwellir.com",
  },
  {
    name: "IBP2",
    url: "wss://kusama.dotters.network",
  },
  {
    name: "RadiumBlock",
    url: "wss://kusama.public.curie.radiumblock.co/ws",
  },
  {
    name: "RockX",
    url: "wss://rockx-ksm.w3node.com/polka-public-ksm/ws",
  },
  {
    name: "Stakeworld",
    url: "wss://ksm-rpc.stakeworld.io",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-kusama.luckyfriday.io",
  },
];

export const DEFAULT_POLKADOT_NODES = [
  {
    name: "IBP1",
    url: "wss://rpc.ibp.network/polkadot",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io",
  },
  {
    name: "SubQuery",
    url: "wss://polkadot.rpc.subquery.network/public/ws",
  },
  {
    name: "Permanence DAO EU",
    url: "wss://polkadot.rpc.permanence.io",
  },
  {
    name: "Dwellir",
    url: "wss://polkadot-rpc.dwellir.com",
  },
  {
    name: "Helixstreet",
    url: "wss://rpc-polkadot.helixstreet.io",
  },
  {
    name: "Allnodes",
    url: "wss://polkadot-rpc.publicnode.com",
  },
  {
    name: "Blockops",
    url: "wss://polkadot-public-rpc.blockops.network/ws",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://polkadot-rpc-tn.dwellir.com",
  },
  {
    name: "RadiumBlock",
    url: "wss://polkadot.public.curie.radiumblock.co/ws",
  },
  {
    name: "RockX",
    url: "wss://rockx-dot.w3node.com/polka-public-dot/ws",
  },
  {
    name: "Stakeworld",
    url: "wss://dot-rpc.stakeworld.io",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-polkadot.luckyfriday.io",
  },
];

export const DEFAULT_CENTRIFUGE_NODES = [
  {
    name: "Centrifuge",
    url: "wss://fullnode.centrifuge.io",
  },
  {
    name: "Dwellir",
    url: "wss://centrifuge-rpc.dwellir.com/",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-centrifuge.luckyfriday.io",
  },
  {
    name: "OnFinality",
    url: "wss://centrifuge-parachain.api.onfinality.io/public-ws",
  },
];

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_QUERY_PAGE = 1;

export const TimelineItemType = {
  CouncilMotion: "council-motion",
  DemocracyReferendum: "democracy-referendum",
  Gov2Referendum: "gov2-referendum",
};

/**
 * @description used in page users
 */
export const USER_ROLES = {
  Councilor: "councilor",
  Beneficiary: "beneficiary",
  Proposer: "proposer",
};

/**
 * @description empty table data structure
 */
export const EMPTY_TABLE_DATA = {
  items: [],
  page: 0,
  pageSize: 10,
  total: 0,
};
