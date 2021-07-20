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
    token: "dot",
    amount: 1849,
    proposalId: 53,
    proposeTimePrice: 23.78,
    title:
      "Cover cost for 07.2021 - 09.2021 of the social contract between Polkassembly and Polkadot/Kusama Treasury",
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
