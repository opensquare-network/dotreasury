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
const polkassembly = require("../common/polkassembly");
const speckWallet = require("./speckWallet");
const dwellir = require("../common/dwellir");
const nomi = require("./nomi");
const novaWallet = require("./novaWallet");
const parachainsInfo = require("./parachainsInfo");
const patractLabs = require("../common/patractLabs");
const polkashotsIo = require("../common/polkashotsIo");

const projects = [
  polkassembly,
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
  speckWallet,
  dwellir,
  nomi,
  novaWallet,
  parachainsInfo,
  patractLabs,
  polkashotsIo,
];

module.exports = [...projects].sort((p1, p2) => p2.startTime - p1.startTime);
