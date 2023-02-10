export const TEXT_DARK_MAJOR = "rgba(0, 0, 0, 0.9)";
export const TEXT_DARK_ACCESSORY = "rgba(0, 0, 0, 0.3)";
export const TEXT_DARK_MINOR = "rgba(0, 0, 0, 0.65)";
export const TEXT_DARK_DISABLE = "rgba(0, 0, 0, 0.15)";
export const TEXT_LIGHT_MAJOR = "#ffffff";
export const TEXT_LIGHT_MINOR = "rgba(255, 255, 255, 0.8)";
export const Tertiary_Blue_500 = "#086DE3";
export const Tertiary_Green_500 = "#0EAB0E";
export const Greyscale_Grey_100 = "#fafafa";
export const Greyscale_Grey_200 = "#f4f4f4";
export const Primary_Theme_Pink_100 = "#FFF0F3";
export const Primary_Theme_Pink_200 = "#ffc5ce";
export const Primary_Theme_Pink_300 = "#FC7C91";
export const Primary_Theme_Pink_400 = "#F8526E";
export const Primary_Theme_Pink_500 = "#F23252";
export const Primary_Theme_Yellow_500 = "#f2b12f";
export const Primary_Theme_Orange_500 = "#f27532";
export const PRIMARY_THEME_COLOR = "#DF405D";
export const SECONDARY_THEME_COLOR = "#FFEEF1";
export const WARNING_COLOR = "#EC4730";

export const OVERVIEW_PROPOSALS_COLOR = "#DF405D";
export const OVERVIEW_TIPS_COLOR = "#F1AC26";
export const OVERVIEW_BOUNTIES_COLOR = "#635FEC";
export const OVERVIEW_BURNT_COLOR = "#EE7735";
export const OVERVIEW_INFLATION_COLOR = "#DF405D";
export const OVERVIEW_TREASURY_COLOR = "#FCC04D";
export const OVERVIEW_STAKING_COLOR = "#F1AC26";
export const OVERVIEW_DEMOCRACY_COLOR = "#FFDFA0";
export const OVERVIEW_ELECTION_COLOR = "#FED077";
export const OVERVIEW_IDENTITY_COLOR = "#FFEDC9";
export const OVERVIEW_OTHERS_COLOR = "#CCCCCC";

export const OVERVIEW_TREASURER_COLOR = "#F23252";
export const OVERVIEW_SMALL_TIPPER_COLOR = "#f2b12f";
export const OVERVIEW_BIG_TIPPER_COLOR = "#f27532";
export const OVERVIEW_SMALL_SPENDER_COLOR = "#635fec";
export const OVERVIEW_MEDIUM_SPENDER_COLOR = "#086de3";
export const OVERVIEW_BIG_SPENDER_COLOR = "#4caf91";

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
};

export const ProposalStatus = {
  Approved: "Approved",
  Rejected: "Rejected",
};

export const TreasuryAccount =
  "F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29";

export const REACTION_THUMBUP = 1;
export const REACTION_THUMBDOWN = 2;

export const DEFAULT_KUSAMA_NODE_URL = "wss://kusama-rpc.polkadot.io";
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
    name: "RadiumBlock",
    url: "wss://kusama.public.curie.radiumblock.co/ws",
  },
];

export const DEFAULT_POLKADOT_NODE_URL = "wss://rpc.polkadot.io/";
export const DEFAULT_POLKADOT_NODES = [
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io/",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://polkadot-rpc.dwellir.com",
  },
];

export const CHAINS = {
  POLKADOT: "dot",
  KUSAMA: "ksm",
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
