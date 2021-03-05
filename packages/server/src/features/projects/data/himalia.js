const id = "himalia";
const name = "Himalia";
const title =
  "Himalia will provide FRAME Contracts SDK supports in a multi-language environment to support WASM DApp development.";
const description =
  "Multi-language contract SDK. Himalia supports developers to interact with contracts in multiple development languages from different clients, including PatractGo, PatractPy, PatractJ, PatractN etc.";
const logo = "himalia-logo.svg";
const startTime = 1607416086000;

const relatedLinks = [
  {
    link: "https://github.com/patractlabs/go-patract",
    description: "PatractGo Repository",
  },
  {
    link: "https://github.com/patractlabs/py-patract",
    description: "PatractPy Repository",
  },
];

const proposals = [
  {
    token: "ksm",
    amount: 466,
    proposalId: 61,
    proposeTimePrice: 52.6,
    title: "Himalia v0.1 & v0.2: WASM contract sdks in Go and Python",
    achievements: ["v0.1 for PatractGo", "v0.2 for PatractPy"],
  },
];

module.exports = {
  id,
  name,
  logo,
  title,
  description,
  proposals,
  relatedLinks,
  startTime,
};
