const knownHeights = require("./heights");

module.exports = {
  knownHeights,
  maxKnownHeight: knownHeights[knownHeights.length - 1],
};
