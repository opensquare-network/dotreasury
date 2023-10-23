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

export const TreasuryAccount =
  "F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29";

export const REACTION_THUMBUP = 1;
export const REACTION_THUMBDOWN = 2;

export const DEFAULT_KUSAMA_NODES = [
  {
    name: "Parity",
    url: "wss://kusama-rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://kusama.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://kusama-rpc.dwellir.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://kusama-rpc-tn.dwellir.com",
  },
  {
    name: "Automata 1RPC",
    url: "wss://1rpc.io/ksm",
  },
  {
    name: "IBP-GeoDNS1",
    url: "wss://rpc.ibp.network/kusama",
  },
  {
    name: "IBP-GeoDNS2",
    url: "wss://rpc.dotters.network/kusama",
  },
  {
    name: "RadiumBlock",
    url: "wss://kusama.public.curie.radiumblock.co/ws",
  },
];

export const DEFAULT_POLKADOT_NODES = [
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://polkadot-rpc.dwellir.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://polkadot-rpc-tn.dwellir.com",
  },
  {
    name: "Automata 1RPC",
    url: "wss://1rpc.io/dot",
  },
  {
    name: "IBP-GeoDNS1",
    url: "wss://rpc.ibp.network/polkadot",
  },
  {
    name: "IBP-GeoDNS2",
    url: "wss://rpc.dotters.network/polkadot",
  },
  {
    name: "RadiumBlock",
    url: "wss://polkadot.public.curie.radiumblock.co/ws",
  },
];

export const DEFAULT_CENTRIFUGE_NODES = [
  {
    name: "Parity",
    url: "wss://fullnode.centrifuge.io/",
  },
  {
    name: "LuckFriday",
    url: "wss://rpc-centrifuge.luckyfriday.io/",
  },
];

export const CHAINS = {
  POLKADOT: "polkadot",
  KUSAMA: "kusama",
  CENTRIFUGE: "centrifuge",
};

export const SYMBOLS = {
  DOT: "dot",
  KSM: "ksm",
  CFG: "cfg",
};

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
