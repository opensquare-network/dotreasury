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
    amount: 647.07,
    proposalId: 41,
    proposeTimePrice: 37.2,
    title: "PolkaWorld website development",
    achievements: [
      "Home page developed to support posts and banners",
      "Wiki page developed",
    ],
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
