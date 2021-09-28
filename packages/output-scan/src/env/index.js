const scanStep = parseInt(process.env.SCAN_STEP) || 100;

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

function getScanStep() {
  return scanStep;
}

module.exports = {
  currentChain,
  CHAINS,
  getScanStep,
};
