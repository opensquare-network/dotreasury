const id = "rotki";
const name = "Rotki";
const title = "Rotki integration";
const description =
  "Rotki is an open source portfolio tracker, accounting and analytics tool that respects your privacy. The mission is to bring transparency into both the crypto and traditional financial sectors through the use of open source. Most importantly, unlike virtually every other competing service which consists of closed source webapps onto which you are forced to hand over all your financial data, with Rotki your data is stored encrypted locally in your computer.";
const logo = "rotki-logo.svg";
const startTime = 1607091600000;

const proposals = [
  {
    token: "ksm",
    amount: 289,
    proposalId: 78,
    proposeTimePrice: 129.3,
    title: "Milestone 2",
    achievements: [
      "Perform transaction history query for the imported addresses by using the connected KSM node and show them in the Rotki UI in the blockchain transactions component.",
      "Detect if any of the user’s addresses are actively staking, and if yes show how much profit they have made (counting historical KSM prices) and show expected profits in the UI. Also calculate profit for addresses that have staked so far in the past.",
      "Add the staking information in the Rotki UI staking component so users can see a breakdown of staking info per address.",
    ],
  },
  {
    token: "ksm",
    amount: 387.27,
    proposalId: 60,
    proposeTimePrice: 61.6,
    title: "Milestone 1",
    achievements: [
      "Have the Rotki team study and understand Kusama Network better, so that we can figure out what is needed from a technical perspective in order to accomplish the following objectives.",
      "Add a new blockchain type (KSM) in Rotki and allow import of addresses for it",
      "Add a new setting for the users to provide a custom endpoint if they run their own node. If not use the default nodes ran by web3 foundation and Parity: https://guide.kusama.network/docs/en/kusama-endpoints",
      "Perform balance queries for the imported addresses by using the connected KSM node and show them in the Rotki UI",
    ],
  },
];

module.exports = {
  id,
  logo,
  name,
  startTime,
  title,
  description,
  proposals,
};
