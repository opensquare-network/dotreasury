const id = "polkawallet";
const name = "Polkawallet";
const description = "A mobile wallet for polkadot.";
const logo = "polkawallet-logo.svg";
const startTime = 1591848372015;

const relatedLinks = [
  {
    link: "https://polkawallet.io/",
    description: "Polkawallet Website",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 0.01,
    proposalId: 27,
    proposeTimePrice: 5.8,
    title: "Proposal discussion",
    achievements: [
      "Polkawallet team list their proposal milestones and have a discussion with councilors",
    ],
  },
  {
    token: "ksm",
    amount: 1403,
    proposalId: 32,
    proposeTimePrice: 6.4,
    title: "Polkawallet Treasury Proposal - M1",
    achievements: [
      "Social Recovery: support observer mode, account recovery settings, recovery account agent operation",
      "Offline signature: support offline signing QR code, send signed transactions",
    ],
  },
  {
    token: "ksm",
    amount: 3858,
    proposalId: 41,
    proposeTimePrice: 13.5,
    title: "Polkawallet Treasury Proposal - M2&3",
    achievements: [
      "Support treasury functionalities",
      "Support democracy functionalities",
      "Show motions and support councilors' vote",
      "Polkassembly integration",
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
