const id = "statescan";
const name = "Statescan";
const title = "Statemine|Statemint asset explorer";
const description =
  "Statescan is an explorer for Kusama|Polkadot asset parachains. Currently it has implemented Statemine and Westmint.";
const logo = "statescan-logo.svg";
const startTime = 1625135166010;

const relatedLinks = [
  {
    link: "https://www.statescan.io",
    description: "Statescan Website",
  },
  {
    link: "https://github.com/opensquare-network/statescan",
    description: "Github Repo",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 79.48,
    proposalId: 103,
    proposeTimePrice: 194.4,
    title:
      "Implement Statemine and Westmint",
    achievements: [
      'Basic pages like blocks, extrinsics, events, assets list and detail',
      'Asset lifecycle scan and view',
      'Cross chain asset teleports',
      'Make pages SSR',
      'Unfinalized business handling',
    ],
  },
  {
    token: "ksm",
    amount: 69.52,
    proposalId: 115,
    proposeTimePrice: 347.2,
    title:
      "Statescan NFT business implementation and features polish",
    achievements: [
    ],
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
