const id = "subscan";
const name = "Subscan";
const title = "An aggregated Blockchain explorer for Substrate-based chains.";
const description =
  "Subscan is an aggregated Blockchain explorer for Substrate-based chains, and have supported several chains, such as Polkadot, Kusama, and Westend, for more than one year.";
const startTime = 1604573208000;

const logo = "subscan-logo.svg";
const relatedLinks = [
  {
    link: "https://www.subscan.io/",
    description: "Subscan website",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 75,
    proposalId: 54,
    proposeTimePrice: 29.234,
    title: "Cover operation cost for 12.2020 - 02.2021",
    achievements: [],
  },
  {
    token: "dot",
    amount: 1000,
    proposalId: 22,
    proposeTimePrice: 4.42,
    title: "Cover operation cost for 12.2020 - 02.2021",
    achievements: [],
  },
  {
    token: "dot",
    amount: 780,
    proposalId: 54,
    proposeTimePrice: 22.1,
    title: "Cover operation cost for 03.2021 - 05.2021",
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
