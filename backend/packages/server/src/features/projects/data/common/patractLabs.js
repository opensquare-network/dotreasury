const id = "patract-labs";
const name = "Patract Labs";
const description = "Patract is developing development tools and services for Polkadot’s Wasm contract technology.";
const logo = "patract-logo.svg";
const startTime = 1639473696009;

const relatedLinks = [
  {
    link: "https://patract.io/",
    description: "Patract Website",
  },
];

const proposals = [
  {
    token: "dot",
    amount: 1770,
    proposalId: 78,
    proposeTimePrice: 26.14,
    title: "Patract Labs' maintenance cost for Polkadot of 2021",
    achievements: [
    ],
  },
  {
    token: "ksm",
    amount: 234,
    proposalId: 123,
    proposeTimePrice: 277.77,
    title: "Patract Labs' maintenance cost for Kusama of 2021",
    achievements: [
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
