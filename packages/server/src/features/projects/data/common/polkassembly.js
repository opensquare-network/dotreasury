const id = "polkassembly";
const name = "Polkassembly";
const title = "Governance forum for Polkadot and Kusama";
const description =
  "Polkaseembly is a governance forum for Polkadot and Kusama.";
const startTime = 1623920940001;

const logo = "polkassembly-logo.svg";
const relatedLinks = [
  {
    link: "https://kusama.polkassembly.io/",
    description: "Polkassembly Kusama",
  },
  {
    link: "https://polkadot.polkassembly.io/",
    description: "Polkassembly Polkadot",
  },
];

const proposals = [
  {
    type: "child-bounty",
    token: "ksm",
    id: 14,
  },
  {
    token: "ksm",
    amount: 911.31,
    proposalId: 155,
    proposeTimePrice: 78.2,
    title:
      "Covers costs for 04.2022 - 06.2022 maintenance",
    achievements: [],
  },
  {
    token: "dot",
    amount: 4690,
    proposalId: 99,
    proposeTimePrice: 17.12,
    title:
      "Polkassembly Product Improvement",
    achievements: [],
  },
  {
    token: "dot",
    amount: 1581.67,
    proposalId: 83,
    proposeTimePrice: 24.14,
    title:
      "Polkassembly Social Contract Q1 2022",
    achievements: [],
  },
  {
    token: "ksm",
    amount: 129,
    proposalId: 116,
    proposeTimePrice: 379,
    title:
      "Covers costs for 10.2021 - 12.2021 of the social contract between Polkassembly and Polkadot/Kusama Treasury",
    achievements: [],
  },
  {
    token: "dot",
    amount: 1849,
    proposalId: 53,
    proposeTimePrice: 23.78,
    title:
      "Cover costs for 07.2021 - 09.2021 of the social contract between Polkassembly and Polkadot/Kusama Treasury",
    achievements: [],
  },
];

module.exports = {
  id,
  logo,
  name,
  title,
  description,
  startTime,
  relatedLinks,
  proposals,
};
