const id = "polkastats";
const name = "PolkaStats";
const title = "Polkadot/Kusama explorers";

const description = `Providing infrastructure services for the Kusama/Substrate community.`;
const startTime = 1600342332000;
const logo = "polkastats-logo.svg";

const relatedLinks = [
  {
    link: "https://polkastats.io/",
    description: "PolkaStats Website",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 23.07,
    proposalId: 47,
    proposeTimePrice: 43.22,
    title: "PolkaStats hardware operational costs treasury expense proposal",
    achievements: [],
  },
  {
    token: "dot",
    amount: 172.84,
    proposalId: 12,
    proposeTimePrice: 4,
    title: "PolkaStats hardware operational costs treasury expense proposal",
    achievements: [],
  },
  {
    token: "ksm",
    amount: 6.27,
    proposalId: 77,
    proposeTimePrice: 118.08,
    title: "Operation costs for Kusama, 17.12.2020 - 17.03.2021",
    achievements: [],
  },
  {
    token: "dot",
    amount: 37.08,
    proposalId: 34,
    proposeTimePrice: 20.54,
    title: "Operation costs for Polkadot, 21.12.2020 to 21.03.2021",
    achievements: [],
  },
];

module.exports = {
  id,
  name,
  logo,
  title,
  description,
  startTime,
  proposals,
  relatedLinks,
};
