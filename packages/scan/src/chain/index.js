function currentChain() {
  if (["polkadot", "kusama"].includes(process.env.CHAIN)) {
    return process.env.CHAIN;
  } else {
    return "kusama";
  }
}

const CHAINS = {
  POLKADOT: "polkadot",
  KUSAMA: "kusama",
};

module.exports = {
  currentChain,
  CHAINS,
};
