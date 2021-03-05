const id = "dotreasury";
const name = "doTreasury";
const title = "";
const description = `doTreasury aim to introduce remarks from councilors and communities to improve current kusama/polkadot treasury with a retrospect mechanism.`;
const startTime = 1606795356000;
const logo = "dotreasury-logo.svg";
const relatedLinks = [
  {
    link: "https://www.dotreasury.com",
    description: "Dotreasury Website",
  },
  {
    link: "https://github.com/opensquare-network/dotreasury",
    description: "Github Repo",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 531,
    proposalId: 58,
    proposeTimePrice: 51,
    title: "Milestone 1: Kusama treasury expense explorer",
    achievements: [
      "List and detail page for Kusama network proposals, tips and bounties.",
      "Overview page which show the KSM expense distribution, and top beneficiaries, top tip finders.",
      "Scan scripts which scan the finalized blocks and extract the corresponding business.",
      "A restful server which serve the treasury business data.",
    ],
  },
  {
    token: "ksm",
    amount: 438,
    proposalId: 75,
    proposeTimePrice: 95,
    title: "Milestone 2: Show Kusama income and support community comment",
    achievements: [
      "Scan and show the Kusama network treasury income.",
      "Support account register and comment.",
      "Show Kusama treasury funded project list.",
      "Polish product details.",
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
