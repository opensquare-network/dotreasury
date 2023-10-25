const chains = Object.freeze({
  polkadot: "polkadot",
  kusama: "kusama",
  centrifuge: "centrifuge",
});

const chainDecimals = Object.freeze({
  [chains.polkadot]: 10,
  [chains.kusama]: 12,
  [chains.centrifuge]: 18,
});

module.exports = {
  chains,
  chainDecimals,
}
