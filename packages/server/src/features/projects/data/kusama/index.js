const dotreasury = require("../common/dotreasury");
const polkawallet = require("./polkawallet");
const fearlessWallet = require("./fearlessWallet");
const ask = require("./ask");
const himalia = require("./himalia");
const LocalCoinSwap = require("../common/localCoinSwap");
const localKSM = require("./localKSM");
const kusamaProject = require("./kusamaProject");
const rotki = require("./rotki");
const polkascan = require("../common/polkascan");
const onfinality = require("../common/onFinality");
const polkastats = require("../common/polkaStats");
const subscan = require("../common/subscan");
const statescan = require("./statescan");

const projects = [
  statescan,
  subscan,
  polkastats,
  onfinality,
  polkascan,
  dotreasury,
  polkawallet,
  fearlessWallet,
  ask,
  himalia,
  LocalCoinSwap,
  localKSM,
  kusamaProject,
  rotki,
];

module.exports = [...projects].sort((p1, p2) => p2.startTime - p1.startTime);
