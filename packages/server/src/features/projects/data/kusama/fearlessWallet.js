const id = "fearless-wallet";
const name = "Fearless Wallet";
const description =
  "Fearless Wallet is focused on providing the best user experience, fast performance, and secure storage for your accounts. In addition to Kusama and Polkadot features, there will be DEX support in the future releases.";
const logo = "fearless-logo.svg";
const startTime = 1590044478000;

const proposals = [
  {
    token: "ksm",
    amount: 563.53,
    proposalId: 102,
    proposeTimePrice: 206.98,
    title: "Multi-asset & networks support proposal",
    achievements: [],
  },
  {
    token: "ksm",
    amount: 1373.0445,
    proposalId: 74,
    proposeTimePrice: 95,
    title: "Stage 3",
    achievements: [
      "Staking",
      "General app improvements",
      "Native mobile libraries expansion",
    ],
  },
  {
    token: "dot",
    amount: 8677.405,
    proposalId: 33,
    proposeTimePrice: 15.27,
    title: "Fearless Wallet - Stage 3 Proposal - Staking, Libraries expansion, App Improvements",
    achievements: [],
  },
  {
    token: "ksm",
    amount: 2500,
    proposalId: 34,
    proposeTimePrice: 9.4,
    title: "Stage 2",
    achievements: [
      "Public release of the iOS and Android app that will include: registration, view balance, send/receive, settings, Extrinsics tab (added after Stage 1) and Mobile libraries (added after Stage 1).",
    ],
  },
  {
    token: "ksm",
    amount: 1660,
    proposalId: 23,
    proposeTimePrice: 5.5,
    title: "Stage 1",
    achievements: [
      "Software Specification",
      "Architecture document",
      "UX/UI low- and high-fidelity mockups",
      "internal iOS app with registration, balance and settings features",
    ],
  },
];

module.exports = {
  id,
  logo,
  name,
  startTime,
  description,
  proposals,
};
