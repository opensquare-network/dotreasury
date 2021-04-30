const id = "zkmega";
const name = "zkMega";
const title = "A zero-knowledge proof tool set building for the Polkadot ecology.";
const description =
  "zkMega is a zero-knowledge proof tool set building for the Polkadot ecology.";
const startTime = 1606205484000;
const logo = "zkmega-logo.svg";

const relatedLinks = [];

const proposals = [
  {
    token: "dot",
    amount: 5431,
    proposalId: 24,
    proposeTimePrice: 6.0,
    title: "zkMega v0.1",
    achievements: [
      "Integrate addition (ADD), scalar multiplication (MUL) and Pairing functions of the curves in Native layer and Runtime WASM layer.",
      "Provide these three functions to the upper Runtime Pallets and Contracts to call.",
      "In the Runtime layer and the Ink! contract layer, provide two zkSNARK Verify upper-layer interfaces ( verification function of groth16, similar to the Verifier library of ethsnarks).",
      "Start the Metis project and implement EdDSA, MerkleTree, MiMC Hash, etc. contract library on the Ink! contract layer."
    ],
  }
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
