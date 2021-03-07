const id = "localcoinswap";
const name = "LocalCoinSwap";
const description = "LocalCoinSwap is a non-custodial P2P trading platform";
const logo = "localcoinswap-logo.svg";
const startTime = 1587142392000;

const proposals = [
  {
    token: "ksm",
    amount: 2300,
    proposalId: 14,
    proposeTimePrice: 3.1,
    title: "Milestone 1",
    achievements: [
      "D1: Basic instantiation of repo and associated documentation",
      "D2: Use a mnemonic phrase to generate priv/pub pairs for the buyer, seller, and arbitrator",
      "D3: Fund seller address, check balance and validity of transaction",
      "D4: Creation of reference Blockchain transactions for the P2P trading process",
      "D5: Construction of reference transactions using available Python libraries",
      "D6: Associated functionality which might be necessary for integration delivered in reference documentation",
    ],
  },
  {
    token: "ksm",
    amount: 2300,
    proposalId: 22,
    proposeTimePrice: 5.5,
    title: "Milestone 2",
    achievements: [
      "D1: Handler class instantiation, connecting it to a node, connection tests",
      "D2: Tests for the creation of escrow pass, including tx broadcast",
      "D3: Tests for the release of escrow pass",
      "D4: Tests for associated functionality pass",
      "D5: Error handling and associated tests, ensuring that exceptions are not suppressed at a library level and instead passed upwards in a useful way.",
    ],
  },
  {
    token: "ksm",
    amount: 2300,
    proposalId: 26,
    proposeTimePrice: 5.5,
    title: "Milestone 3",
    achievements: [
      "D1: Basic node-API instantiation and tests of connectivity",
      "D2: Python library functionality from milestone 2 wrapped into API endpoints, with tests",
      "D3: Service can handle various types of downtime and interruption in an automated manner, including losing connection to the Kusama/Polkadot node, request flooding, and surprise restarts.",
      "D4: Automated setup and provided documentation for launching the service",
      "D5: Dockerfiles and images provided with reference build",
    ],
  },
  {
    token: "ksm",
    amount: 2300,
    proposalId: 33,
    proposeTimePrice: 8.1,
    title: "Milestone 4",
    achievements: [
      "D1: Basic connectivity functions for each node-API endpoint in Django",
      "D2: Trading tests for all situations (standard trade, cancellation, disputes) from start to finish, using the same Django API which frontend consumes",
      "D3: Wallet functionality tests using the Django API",
      "D4: Account upgrade process and tests using the Django API, ensuring that frontend users will not have their UX interrupted when generating non-custodial KSM/DOT wallets",
      "D5: Price feeds for KS integrated into backend and made available through API",
    ],
  },
  {
    token: "ksm",
    amount: 2300,
    proposalId: 42,
    proposeTimePrice: 13.5,
    title: "Milestone 5",
    achievements: [
      "D1: Basic crypto functionality needed for trading and associated tests",
      "D2: Basic crypto functionality needed for wallets and associated tests",
      "D3: Flagged users can open up KSM trades using a wallet extension or offsite wallet",
      "D4: Flagged users can complete the non-custodial KSM trading process",
      "D5: Flagged users can access on-site KSM wallets with exportable private keys, and use all required functionality. This includes generating addresses on the fly from users exportable mnemonic phrases",
      "D6: Silent wallet launch, all frontend accounts automatically upgrade to provide users with encrypted KSM/DOT wallets. Wallet functionality exposed on hidden URL",
      "D7: Silent trading launch, all users can trade KSM/DOT provided they have a relevant trade offer. Only staff or flagged users can create trade offers. The objective is to get as close to launch as possible from the codebase standpoint to eliminate potential technical errors in the final rollout.",
      "D8: Public launch. URL’s for wallets changed and KSM/DOT added to currencies which users can create trade offers for. The exact announcements, timing and other parameters involved can be determined by the relevant marketing teams.",
    ],
  },
];

module.exports = {
  id,
  logo,
  name,
  description,
  startTime,
  proposals,
};
