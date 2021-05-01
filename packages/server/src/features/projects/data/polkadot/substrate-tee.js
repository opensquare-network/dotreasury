const id = "substratetee";
const name = "Substrate TEE";
const title =
  "A framework for Parity Substrate, allowing to call a custom state transition function (STF) inside a Trusted Execution Environment (TEE)";
const description =
  "substraTEE is a framework for Parity Substrate, allowing to call a custom state transition function (STF) inside a Trusted Execution Environment (TEE), namely an Intel SGX enclave thereby providing confidentiality and integrity. The enclaves operate on an encrypted state which can be read and written only by a set of provisioned and remote-attested enclaves.";
const startTime = 1601487042000;
const logo = "substrate-tee-logo.svg";

const relatedLinks = [
  {
    link: "https://www.substratee.com/",
    description: "Substrate TEE Website",
  },
];

const proposals = [
  {
    token: "dot",
    amount: 1788.59,
    proposalId: 40,
    proposeTimePrice: 33.14,
    title: "M8.3",
    achievements: [
      "Improve SubstraTEE-node enclave registry to simplify shard authority set lookup",
      "Implement block broadcast logic",
      "Implement pruning and snapshotting that will allow new workers to join in",
      "Implement layer one pallet that enforces block production rules",
      "Implement test setup where workers join and go offline",
      "Tutorial how to use the new SubstraTEE-framework to boost scalability for a simple use case",
    ],
  },
  {
    token: "dot",
    amount: 1405,
    proposalId: 35,
    proposeTimePrice: 23.2,
    title: "M8.2",
    achievements: [
      "Refactor execution sequence",
      "Implement new Block type",
      "Implement journaling of state updates (similar to substrate) and generate a diff per block that can be applied by other workers (StateUpdate)",
      "Implement execution time limit",
      "Send block confirmations to layer one",
    ],
  },
  {
    token: "dot",
    amount: 8000,
    proposalId: 14,
    proposeTimePrice: 4.3,
    title: "M8.1",
    achievements: [
      "Implement RPC interface replacing the current websocket worker-api",
      "Implement tx pool based on substrate",
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
