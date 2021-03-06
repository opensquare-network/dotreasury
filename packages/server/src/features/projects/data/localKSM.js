const id = "local-ksm";
const name = "Local KSM";
const title =
  "LocalKSM.com apps (iOS and Android) implementing Air Protocol for censorship resistant non custodial p2p exchange.";
const description =
  "LocalKSM is an implementation of the Air Protocol to create a P2P exchange focused on KSM tokens. The project will consist of an app for iOS and Android that enables users anywhere to list proposals for selling or buying KSM at a rate they specify and with a payment method of their choice.";
const logo = "localksm-logo.svg";

const startTime = 1587144300000;

const relatedLinks = [
  {
    link: "https://localksm.com/",
    description: "Local KSM Website",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 4400,
    proposalId: 35,
    proposeTimePrice: 9.4,
    title: "Milestone 3 — Finalization & Launch preparation",
    achievements: [
      "Do thorough testing of the app in the mainnet and go through functionalities pre launch",
      "Prepare infrastructure for deployment to production",
      "Launch LocalKSM!",
    ],
  },
  {
    token: "ksm",
    amount: 2200,
    proposalId: 24,
    proposeTimePrice: 6.3,
    title: "Milestone 2 — App KSM related Utilities & App API changes",
    achievements: [
      "KMS(Key Management service)",
      "Creation of wallets for users",
      "Changes to maintain local KSM flows and transactional data requirements",
      "Finish App logic and changes to GraphQL API",
      "Creation of utility methods in Kusama integration for data visualization",
      "Other app functionalities, like onboarding, Email notifications, Filter transactions, etc",
      "Jury system",
      "Error correction for multisig in case of issues while submitting the transaction",
    ],
  },
  {
    token: "ksm",
    amount: 4400,
    proposalId: 15,
    proposeTimePrice: 3,
    title: "Milestone 1 — Implement KSM support & Design",
    achievements: [
      "Develop wrapper for multisig from utility pallet",
      "Creation of base methods required to support KSM",
      "Air Protocol adjustments to KSM specific functions or required data",
      "Details to change on front end pre existing components",
      "Customization of views",
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
  proposals,
  startTime,
};
