const id = "parachain-info";
const name = "Parachain.Info!";
const title = "Parachain.Info!";
const description = "Parachains.info provides users of the Polkadot ecosystem with a centralised repository of unbiased information regarding parachain projects and auctions.";
const logo = "parachainInfo-logo.svg";
const startTime = 1636556790011;
const relatedLinks = [
  {
    link: "https://parachains.info/",
    description: "Parachain.Info Website",
  },
];

const proposals = [
  {
    type: "tip",
    token: "ksm",
    tipId: `0xb4828177a51a4062826fd252fd4ea20c08aae3ab9167e1e72eea668b785220a0`,
  },
  {
    token: "ksm",
    amount: 36.31,
    proposalId: 119,
    proposeTimePrice: 456.29,
    title: "Maintenance and future development of Parachains.info",
    achievements: [
    ],
  },
];

module.exports = {
  id,
  name,
  logo,
  startTime,
  title,
  description,
  proposals,
  relatedLinks,
};
