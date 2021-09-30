const scanStep = parseInt(process.env.SCAN_STEP) || 100;
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

function getScanStep() {
  return scanStep;
}

module.exports = {
  currentChain,
  CHAINS,
  getScanStep,
  setChain,
};
