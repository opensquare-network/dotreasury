const id = "Nomi";
const name = "Nomi";
const description = "Nomi is a decision support tool for Nominators in NPoS networks.";
const logo = "nomi-logo.svg";
const startTime = 1591848372015;

const relatedLinks = [
  {
    link: "https://beta.turboflakes.io/#/kusama?#nomi",
    description: "NovaWallet Website",
  }
];

const proposals = [
  {
    token: "ksm",
    amount: 165.732,
    proposalId: 126,
    proposeTimePrice: 475.49,
    title: "Nomi Tool Proposal: Nomi is a decision support tool for Nominators in NPoS networks",
    achievements: [
      "Selecting the best performing Validators in the network",
      "Getting recommendations with the latest top ranked Validators",
      "Displaying a contextual call to action to nominate",
    ],
  },
];

module.exports = {
  id,
  logo,
  name,
  description,
  proposals,
  relatedLinks,
  startTime,
};
