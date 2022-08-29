const id = "polkascan";
const name = "Polkascan";
const title = "Polkadot/Kusama explorers";

const description = `Polkascan Foundation aims to make multi-chain data accessible and understandable through various activities including: the development of tools and libraries, the operation of platforms, governance and education. `;
const startTime = 1594724118000;
const logo = "polkascan-logo.svg";

const relatedLinks = [
  {
    link: "https://polkascan.io/",
    description: "Polkascan Website",
  },
  {
    link: "https://github.com/polkascan/social-contract",
    description: "Polkascan Foundation Social Contract",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 361.11,
    proposalId: 36,
    proposeTimePrice: 7.95,
    title: "Part of social contract: August 2020 - October 2020",
    achievements: [],
  },
  {
    token: "dot",
    amount: 3431.651,
    proposalId: 2,
    proposeTimePrice: 3.4,
    title: "Part of social contract: June 2020 - November 2020",
    achievements: [],
  },
  {
    token: "dot",
    amount: 10000,
    proposalId: 8,
    proposeTimePrice: 6.58,
    title: "Part of social contract",
    achievements: [],
  },
  {
    token: "ksm",
    amount: 74.49,
    proposalId: 52,
    proposeTimePrice: 28.914,
    title: "Part of social contract: March 2021 - May 2021",
    achievements: [],
  },
  {
    token: "dot",
    amount: 1011.142,
    proposalId: 19,
    proposeTimePrice: 4.113,
    title: "Part of social contract: December 2020 - February 2021",
    achievements: [],
  },
  {
    token: "ksm",
    amount: 3116.58,
    proposalId: 57,
    proposeTimePrice: 52.168,
    title: "Heterogeneous Multichain Applications",
    achievements: [],
  },
  {
    token: "ksm",
    amount: 33.85,
    proposalId: 73,
    proposeTimePrice: 98.09,
    title: "Part of social contract: February 2021 - April 2021",
    achievements: [],
  },
  {
    token: "dot",
    amount: 484,
    proposalId: 32,
    proposeTimePrice: 15.27,
    title: "Part of social contract: March 2021 - May 2021",
    achievements: [],
  },
  {
    token: "dot",
    amount: 3316.078,
    proposalId: 38,
    proposeTimePrice: 30.565,
    title: "Part of social contract: 6 month extension for the continuation",
    achievements: [],
  },
  {
    token: "dot",
    amount: 1287.23,
    proposalId: 89,
    proposeTimePrice: 19.62,
    title: "Continuation of Maintenance & Support for Python Libraries from 1 October 2021 to 31 December 2021",
    achievements: [],
  },
  {
    token: "dot",
    amount: 841.08,
    proposalId: 109,
    proposeTimePrice: 17.34,
    title: "Continuation of Maintenance & Support for Python Libraries from 1 October 2021 to 31 December 2021",
    achievements: [],
  },
  {
    token: "dot",
    proposalId: 140,
  },
  {
    token: "ksm",
    amount: 201.083,
    proposalId: 147,
    proposeTimePrice: 162.5,
    title: "MVP for Polkascan Calendar Application",
    achievements: [],
  },
  {
    token: "ksm",
    amount: 1148.348,
    proposalId: 164,
    proposeTimePrice: 47.89,
    title: "Open-sourcing Polkascan block-explorer stack",
    achievements: [],
  },
  {
    token: "ksm",
    proposalId: 173,
  },
].reverse();

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
