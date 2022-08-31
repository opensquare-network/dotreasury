const id = "bright-treasury";
const name = "Bright Treasury";
const title = "Treasury management app for dotsama";
const description =
  "BrightTreasury is a standalone web application along with a PWA representation that allows performing basic actions on the Treasury module of Polkadot and Kusama ";

const logo = "bright-treasury-logo.svg";

const relatedLinks = [
  {
    link: "https://treasury.bright.dev/",
    description: "Website",
  },
];

const proposals = [
  {
    type: "child-bounty",
    token: "ksm",
    id: 9,
  },
  {
    type: "proposal",
    token: "ksm",
    proposalId: 179,
  },
  {
    type: "proposal",
    token: "ksm",
    proposalId: 152,
  },
  {
    type: "proposal",
    token: "dot",
    proposalId: 93,
  },
  {
    type: "proposal",
    token: "dot",
    proposalId: 85,
  },
];

module.exports = {
  id,
  logo,
  name,
  title,
  description,
  relatedLinks,
  proposals,
};
