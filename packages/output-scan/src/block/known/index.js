const { currentChain } = require("../../chain/index");
const {
  firstKnowCouncilCloseEventHeight: ksmFirstKnowCouncilCloseEventHeight,
} = require("./ksm");
const {
  firstKnowCouncilCloseEventHeight: dotFirstKnowCouncilCloseEventHeight,
} = require("./dot");

function getFirstKnownCouncilCloseEventHeight() {
  const chain = currentChain();
  if ("kusama" === chain) {
    return ksmFirstKnowCouncilCloseEventHeight;
  } else {
    return dotFirstKnowCouncilCloseEventHeight;
  }
}

module.exports = {
  getFirstKnownCouncilCloseEventHeight,
};
