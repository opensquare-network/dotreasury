const id = "elara";
const name = "Elara";
const title = "Infura in polkadot ecosystem.";
const description =
  "Elara is inspired by Infura from the Ethereum ecosystem, named after Jupiter’s seventh moon. Elara's goal is to build a similar infrastructure and network public access services to provide developers with a unified access layer based on Substrate multi-chain";
const startTime = 1602484872000;

const logo = "elara-logo.svg";

const relatedLinks = [
  {
    link: "https://elara.patract.io/",
    description: "Elara Website",
  },
];
const proposals = [
  {
    token: "dot",
    amount: 7333,
    proposalId: 18,
    proposeTimePrice: 4.3,
    title: "Redspot v0.2",
    achievements: [
      "Create account space for developers, support developers to use Github as a third-party login method",
      "Support multiple projects under the account space",
      "Provide developers with detailed access information of the DApp project by multiple dimensions, including statistical indicators such as daily and weekly requests, calling methods, and source of user group requests",
      "Optimise program performance",
    ],
  },
  {
    token: "dot",
    amount: 8600,
    proposalId: 16,
    proposeTimePrice: 4.3,
    title: "Elara v0.1",
    achievements: [
      "Create a server-side framework to develop proxy access, automatic monitoring and data statistics to the RPC service of the Substrate node",
      "Support developers to use http and websocket protocols to uniformly access the network through the server framework",
      "Develop a front-end dashboard to display relevant monitoring statistics of the RPC service of the Substrate node",
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
