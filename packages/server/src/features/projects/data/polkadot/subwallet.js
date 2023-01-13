const id = "subwallet";
const name = "SubWallet";
const title = "A polkadot and Ethereum wallet";
const description =
  "SubWallet aspires to become the pioneering user-friendly Web3 Multiverse Gateway for the Polkadot and Kusama ecosystem.";
const logo = "subwallet-logo.svg";

const relatedLinks = [
  {
    link: "https://subwallet.app/",
    description: "Website",
  },
];

const proposals = [
  {
    type: "proposal",
    token: "dot",
    proposalId: 162,
  },
  {
    type: "proposal",
    token: "dot",
    proposalId: 138,
  },
  {
    type: "child-bounty",
    token: "dot",
    id: 83,
  },
  {
    type: "child-bounty",
    token: "dot",
    id: 51,
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
