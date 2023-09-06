const id = "redspot";
const name = "Redspot";
const title = "Truffle in polkadot ecosystem.";
const description =
  "Redspot is named after Jupiter's Great Red Spot, which is also the largest DOT in the solar system. Redspot's target project is Truffle in Truffle Suite. Redspot is a development environment, testing framework and asset pipeline for pallet-contracts. Redspot is trying to let the development of ink! be projectized and simplify the testing and interacting with contracts.";
const startTime = 1597390542000;
const logo = "redspot-logo.svg";

const relatedLinks = [
  {
    link: "https://redspot.patract.io/",
    description: "Redspot Website",
  },
];

const proposals = [
  {
    token: "dot",
    amount: 922,
    proposalId: 23,
    proposeTimePrice: 41.7,
    title: "Redspot v0.4",
    achievements: [
      "v0.4 is the version that reduces the user's use of the door operating system. It provides support for core functions such as multi-contract, Docker compilation, and contract-related UI interfaces, and also adds some other plug-ins, such as Redspot-watcher, Balances decimal plugin, default blockchain types plugin.",
    ],
  },
  {
    token: "dot",
    amount: 7975,
    proposalId: 23,
    proposeTimePrice: 4.46,
    title: "Redspot v0.3",
    achievements: [
      "v0.3 is a production version of Redspot. In this version, we promote Redspot and allow more contract developers to participate. While this version combines the features of Substrate to add various plug-ins, such as Waffle, Jupiter, Gas report.",
    ],
  },
  {
    token: "dot",
    amount: 7650,
    proposalId: 13,
    proposeTimePrice: 4.3,
    title: "Redspot v0.2",
    achievements: [
      "v0.2 is the migration version. Migrate to Hardhat framework to enhance the extensibility of plugins and add some features to provide a smoother development workflow. In version, we provide a complete framework and some necessary plugins, and it's the beta version for RedSpot.",
    ],
  },
  {
    token: "dot",
    amount: 10000,
    proposalId: 0,
    proposeTimePrice: 3.4,
    title: "Redspot v0.1",
    achievements: [
      "v0.1 is the smallest verifiable version. This version builds core functions based on the Truffle framework and provides based features like deploy, compile, and test. This version is the MVP version of Redspot.",
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
