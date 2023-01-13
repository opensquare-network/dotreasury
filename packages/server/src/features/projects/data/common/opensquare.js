const id = "opensquare";
const name = "OpenSquare";
const title = "OpenSquare develops infrastructures for dotsama ecosystem.";
const description =
  "OpenSquare team are developing and doing the maintenance for infrastructure and collaboration products including dotreasury, subsquare, statescan, off-chain voting, etc.";
const logo = "opensquare-logo.svg";

const relatedLinks = [
  {
    link: "https://www.dotreasury.com",
    description: "Dotreasury",
  },
  {
    link: "https://www.subsquare.io",
    description: "Subsquare",
  },
  {
    link: "https://www.statescan.io",
    description: "Statescan",
  },
  {
    link: "https://voting.opensquare.io",
    description: "Off-chain voting",
  },
];

const proposals = [
  {
    type: "child-bounty",
    token: "ksm",
    id: 54,
  },
  {
    type: "child-bounty",
    token: "ksm",
    id: 34,
  },
  {
    type: "child-bounty",
    token: "ksm",
    id: 6,
  },
  {
    type: "proposal",
    token: "ksm",
    proposalId: 146,
  },
  {
    type: "proposal",
    token: "ksm",
    proposalId: 151,
  },
  {
    type: "tip",
    token: "ksm",
    tipId: "0xf265a10d60a813cf41031a2ce452cc3f63daacf630f62f23c980e769920335e0",
  },
  {
    type: "proposal",
    token: "dot",
    proposalId: 155,
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
