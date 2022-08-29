const id = "Nova Wallet";
const name = "Nova Wallet";
const description = "iOS/Android mobile app for Polkadot & Kusama ecosystem, supporting multi-asset (more than 15 networks), DOT/KSM staking, DOT/KSM crowdloans & convenient, secure account management.";
const logo = "nova-logo.svg";
const startTime = 1638949644016;

const relatedLinks = [
  {
    link: "https://github.com/nova-wallet/",
    description: "NovaWallet Github",
  },
  {
    link: "https://novawallet.io/",
    description: "NovaWallet Website",
  }
];

const proposals = [
  {
    token: "ksm",
    amount: 4454,
    proposalId: 158,
    proposeTimePrice: 67.4,
    title: "Nova Wallet 2nd Proposal: Cold Wallets, Cross-chain transfers, Governance, Community-selected features",
    achievements: [
      "Cold Wallets integration: Watch mode, Parity Signer, Ledger",
      "Cross-chain transfers: Polkadot/Kusama <—> Parachains",
      "Governance: The first iteration of the upcoming Governance 2.0",
      "Community-selected features: Based on requests from the community",
    ],
  },
  {
    token: "ksm",
    amount: 780.71,
    proposalId: 122,
    proposeTimePrice: 303.45,
    title: "Nova Wallet Proposal: DApp browser, Statemine/Statemint integration, NFT support, Staking & UI rework and improvements",
    achievements: [
      "DApp browser implementation",
      "Statemine/Statemint tokens integration",
      "Uniques (NFT) pallet integration, RMRK v1 integration",
      "Staking & overall UI rework/improvements based on community feedback",
    ],
  },
];

module.exports = {
  id,
  logo,
  name,
  description,
  proposals,
  relatedLinks,
  startTime,
};
