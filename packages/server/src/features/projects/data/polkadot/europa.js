const id = "europa";
const name = "Europa";
const title = "A sandbox of Substrate runtime environment";
const description =
  "Europa is inspired by Ganache, Ethereumjs-VM and Buidler EVM from the Ethereum ecosystem. Europa is a sandbox of Substrate runtime environment, which would be used to simplify the developing, debugging, and integration test when developers develop Substrate runtime applications and test pallet-contracts. The sandbox will remove P2P and consensus functions, just remaining the execution environment and RPC interface.";
const startTime = 1602077352000;

const logo = "europa-logo.svg";
const relatedLinks = [
  {
    link: "https://github.com/patractlabs/europa",
    description: "Europa github repo",
  },
];
const proposals = [
  {
    token: "dot",
    amount: 7560,
    proposalId: 27,
    proposeTimePrice: 4.94,
    title: "Europa v0.2",
    achievements: [
      "WASM stack traces, the function call stack during WASM contract execution",
      "Contracts stack traces, the call stack of a contract calling another contract",
      "Console.log, provides libraries and methods to print command lines during contract development",
      "Strengthen the error type and error display of the contract module",
      "Simple integration with Redspot",
    ],
  },
  {
    token: "dot",
    amount: 9450,
    proposalId: 15,
    proposeTimePrice: 3.77,
    title: "Europa v0.1",
    achievements: [
      "The independent runtime environment of excluded nodes can be expanded more without the constraints of the node environment and WASM compilation, and can be easily integrated with other components. In this version, it is more like simulating the Ganache project in Ethereum ecosystem, enabling contract developers to develop without having to build a contract blockchain. Developers can quickly fire up a personal Substrate chain, which can be used to run tests, execute commands, and inspect state while controlling how the chain operates.",
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
