const id = "polkaworld";
const name = "PolkaWorld";
const title = "The largest polkadot community in China";
const description =
  "PolkaWorld is the largest polkadot community in China. They developed the site https://polkaworld.org/ with treasury fund.";
const startTime = 1616393928001;
const logo = "polkaworld-logo.svg";

const relatedLinks = [
  {
    link: "https://polkaworld.org/",
    description: "PolkaWorld Website",
  },
];

const proposals = [
  {
    token: "dot",
    amount: 4357,
    proposalId: 63,
    proposeTimePrice: 18.29,
    title: "operational costs of 09.2021.09 - 11.2021",
    achievements: [],
  },
  {
    token: "dot",
    amount: 647.07,
    proposalId: 41,
    proposeTimePrice: 37.2,
    title: "PolkaWorld website development",
    achievements: [
      "Home page developed to support posts and banners",
      "Wiki page developed",
    ],
  },
  {
    token: "dot",
    amount: 1885.98,
    proposalId: 48,
    proposeTimePrice: 35.98,
    title: "Cover operation cost for 06.2021 - 08.2021",
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
