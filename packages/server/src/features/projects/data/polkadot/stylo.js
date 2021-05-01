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
