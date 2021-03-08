const id = "kusama-project";
const name = "Kusama Project";
const title = "A site for all projects in Kusama ecosystem";
const description =
  "KusamaProject provides a directory for people to understand Kusama ecosystem more intuitively. KusamaProject aims to list all projects related to Kusama ecosystem, including tools / wallets / browsers / developers / forums, etc, The project is a website that can be easily accessed from both desktop or mobile.";
const logo = "kusama-project-logo.svg";
const startTime = 1588127796000;

const relatedLinks = [
  {
    link: "http://kusamaproject.com/",
    description: "Kusamaproject Website",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 200,
    proposalId: 20,
    proposeTimePrice: 4.3,
    title: "KusamaProject",
    achievements: [
      "kusamaproject.com is online and we can see ecosystem projects",
    ],
  },
];

module.exports = {
  id,
  name,
  logo,
  title,
  description,
  relatedLinks,
  startTime,
  proposals,
};
