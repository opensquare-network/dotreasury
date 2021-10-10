const scanStep = parseInt(process.env.SCAN_STEP) || 100;
const useKnownHeights = !!process.env.USE_KNOWN_HEIGHTS
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

function firstScanKnowHeights() {
  return useKnownHeights;
}

module.exports = {
  currentChain,
  CHAINS,
  getScanStep,
  setChain,
  firstScanKnowHeights,
};
