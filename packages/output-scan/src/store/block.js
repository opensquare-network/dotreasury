const heightBlockEventsMap = {};

function setHeightBlockEvents(height, blockEvents) {
  heightBlockEventsMap[height] = blockEvents;
}

function getHeightBlockEvents(height) {
  return heightBlockEventsMap[height];
}

function clearHeightBlockEvents(height) {
  delete heightBlockEventsMap[height];
}

module.exports = {
  setHeightBlockEvents,
  getHeightBlockEvents,
  clearHeightBlockEvents,
}
