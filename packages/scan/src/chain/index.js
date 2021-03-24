function currentChain() {
  if (["polkadot", "kusama"].includes(process.env.CHAIN)) {
    return process.env.CHAIN;
  } else {
    return "kusama";
  }
}

module.exports = {
  currentChain,
};
