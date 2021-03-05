const dotreasury = require("./dotreasury");
const polkawallet = require("./polkawallet");
const fearlessWallet = require("./fearlessWallet");
const ask = require("./ask");
const himalia = require("./himalia");
const LocalCoinSwap = require("./localCoinSwap");
const localKSM = require("./localKSM");
const kusamaProject = require("./kusamaProject");
const rotki = require("./rotki");

const projects = [dotreasury, polkawallet, fearlessWallet, ask, himalia, LocalCoinSwap, localKSM, kusamaProject, rotki];

module.exports = projects;
