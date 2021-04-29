const id = "redspot";
const name = "Redspot";
const title = "Truffle in polkadot ecosystem.";
const description =
  "Redspot is named after Jupiter's Great Red Spot, which is also the largest DOT in the solar system. Redspot's target project is Truffle in Truffle Suite. Redspot is a development environment, testing framework and asset pipeline for pallet-contracts. Redspot is trying to let the development of ink! be projectized and simplify the testing and interacting with contracts.";
const startTime = 1597390542000;
const logo = "redspot-logo.svg";

const relatedLinks = [];

const proposals = [
  {
    token: "dot",
    amount: 922,
    proposalId: 23,
    proposeTimePrice: 41.7,
    title: "Redspot v0.4",
    achievements: [
      "Provide Typescript type support for contracts (similar to Typechain), integrate multi-language SDK, etc."
    ]
  },
  {
    token: "dot",
    amount: 7975,
    proposalId: 23,
    proposeTimePrice: 4.46,
    title: "Redspot v0.3",
    achievements: [
      "Promote Redspot and allow more contract developers to participate. Combine the features of Substrate to add various plug-ins, such as Waffle, Jupiter, Gas report.",
    ],
  },
  {
    token: "dot",
    amount: 7650,
    proposalId: 13,
    proposeTimePrice: 4.3,
    title: "Redspot v0.2",
    achievements: [
      "Migrate to Hardhat framework to enhance the extensibility of plugins and add some features to provide a smoother development workflow",
    ],
  },
  {
    token: "dot",
    amount: 10000,
    proposalId: 0,
    proposeTimePrice: 3.4,
    title: "Redspot v0.1",
    achievements: [
      "Build core functions based on Truffle framework",
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
