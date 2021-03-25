const { currentChain } = require("../../chain/index");
const {
  knownHeights: ksmKnownHeights,
  maxKnownHeight: ksmMaxKnownHeight,
  firstKnowCouncilCloseEventHeight: ksmFirstKnowCouncilCloseEventHeight,
} = require("./ksm");
const {
  knownHeights: dotKnownHeights,
  maxKnownHeight: dotMaxKnownHeight,
  firstKnowCouncilCloseEventHeight: dotFirstKnowCouncilCloseEventHeight,
} = require("./dot");

function getKnownHeights() {
  const chain = currentChain();
  if ("kusama" === chain) {
    return ksmKnownHeights;
  } else {
    return dotKnownHeights;
  }
}

function getMaxKnownHeight() {
  const chain = currentChain();
  if ("kusama" === chain) {
    return ksmMaxKnownHeight;
  } else {
    return dotMaxKnownHeight;
  }
}

function getFirstKnownCouncilCloseEventHeight() {
  const chain = currentChain();
  if ("kusama" === chain) {
    return ksmFirstKnowCouncilCloseEventHeight;
  } else {
    return dotFirstKnowCouncilCloseEventHeight;
  }
}

module.exports = {
  getKnownHeights,
  getMaxKnownHeight,
  getFirstKnownCouncilCloseEventHeight,
};
