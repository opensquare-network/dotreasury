const id = "speck-wallet";
const name = "SpeckWallet";
const description = "A new user-friendly wallet extension for the Polkadot ecosystem.";
const logo = "speckWallet-logo.svg";
const startTime = 1636451610051;

const relatedLinks = [
  {
    link: "https://github.com/GetSpeckle/speckle-browser-extension",
    description: "SpeckWallet Github",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 165.732,
    proposalId: 118,
    proposeTimePrice: 403.06,
    title: "Speck Wallet - A new user-friendly wallet extension for the Polkadot ecosystem",
    achievements: [
      "Sending and receiving funds",
      "Address book",
      "Multi-wallet support - with the goal of having a single wallet focused UI",
      "Realtime fiat balance with multiple fiat currency options",
      "Access management for apps using the extension",
      "Developer documentation for integrating the extension",
      "Built in support for staking",
      "Hardware wallet support",
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
