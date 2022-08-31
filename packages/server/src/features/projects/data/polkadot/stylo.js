const id = "stylo";
const name = "Stylo";
const title = "An offline wallet based on Parity Signer";
const description =
  "Stylo is an offline wallet that brings user friendliness to the front seat. It allows storing funds offline. Any interaction with the online world happens by scanning QR codes. Transactions are scanned, using the phone’s camera. They can then be reviewed and signed offline, and finally transmitted to an online wallet by scanning a QR code displayed on the phone, by a computer webcam. Stylo means pen in french.";
const startTime = 1613730330000;

const logo = "stylo-logo.svg";

const relatedLinks = [
  {
    link: "https://stylo-app.com/",
    description: "Stylo App Website",
  },
  {
    link: "https://github.com/stylo-app/stylo",
    description: "Github Repo",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 8.9,
    proposalId: 89,
    proposeTimePrice: 390.78,
    title: "Stylo wallet - recurring payment to cover maintenance costs",
    achievements: [
    ],
  },
  {
    token: "dot",
    amount: 159,
    proposalId: 39,
    proposeTimePrice: 41.7,
    title: "Stylo - an offline wallet based on Parity Signer",
    achievements: [
      "An app available as apk (Github) and on the Android Play store.",
      "Support for DOT, KSM, any Substrate chain and ETH.",
      "Features include: simple message signing, derivation in a similar way than Polkadot-js extension, unlock with fingerprint instead of pin, metadata update over QR code.",
    ],
  },
  {
    token: "dot",
    type: "tip",
    tipId: `0x899aa64528fccd7c5aeafa83a1b85016f26d144315e8a087246c321748aea96f`,
  },
  {
    token: "ksm",
    type: "tip",
    tipId: `0xcfd6e3fe4b395c981eb4fa6f601123df5c62c81c24619a5b48062a0184251f61`,
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
