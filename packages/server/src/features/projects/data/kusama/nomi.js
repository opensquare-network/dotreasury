const id = "nomi";
const name = "Nomi";
const description = "Nomi is a decision support tool for Nominators in NPoS networks.";
const logo = "nomi-logo.svg";
const startTime = 1640772510004;

const relatedLinks = [
  {
    link: "https://www.turboflakes.io",
    description: "Turboflakes",
  }
];

const proposals = [
  {
    token: "ksm",
    amount: 173.882,
    proposalId: 126,
    proposeTimePrice: 300.64,
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
