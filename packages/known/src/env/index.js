const CHAINS = {
  POLKADOT: "polkadot",
  KUSAMA: "kusama",
};

let chain = null;

function setChain(targetChain) {
  chain = targetChain;
}

function currentChain() {
  if (chain) {
    return chain;
  }

  if (["polkadot", "kusama"].includes(process.env.CHAIN)) {
    setChain(process.env.CHAIN);
    return process.env.CHAIN;
  } else {
    return CHAINS.KUSAMA;
  }
}

module.exports = {
  currentChain,
}
